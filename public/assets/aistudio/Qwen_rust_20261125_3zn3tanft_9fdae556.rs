// programs/villagia_merkle_distributor/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("VILLAGIA_MERKLE_PROGRAM_ID");

#[program]
pub mod villagia_merkle_distributor {
    use super::*;

    /// Initialise le contrat avec le Merkle Root (généré off-chain) et le coffre USDC.
    pub fn initialize(ctx: Context<Initialize>, merkle_root: [u8; 32]) -> Result<()> {
        let distributor = &mut ctx.accounts.distributor;
        distributor.merkle_root = merkle_root;
        distributor.usdc_vault = ctx.accounts.vault.key();
        distributor.usdc_mint = ctx.accounts.mint.key();
        distributor.bump = ctx.bumps.distributor;
        distributor.claimed_count = 0;
        Ok(())
    }

    /// Permet à un investisseur de réclamer ses dividendes USDC.
    pub fn claim(ctx: Context<Claim>, amount: u64, proof: Vec<[u8; 32]>) -> Result<()> {
        let distributor = &ctx.accounts.distributor;
        let claimant = ctx.accounts.claimant.key();

        // 1. Vérifier que l'investisseur n'a pas déjà réclamé (via le bitmap ou l'état)
        require!(!ctx.accounts.claim_state.has_claimed, ErrorCode::AlreadyClaimed);

        // 2. Vérifier la preuve Merkle (Zéro Compromis : la mathématique ne ment pas)
        let mut computed_hash = anchor_lang::solana_program::keccak::hashv(&[
            &claimant.to_bytes(),
            &amount.to_le_bytes(),
        ]).to_bytes();

        for p in proof.iter() {
            computed_hash = if computed_hash <= *p {
                anchor_lang::solana_program::keccak::hashv(&[&computed_hash, p]).to_bytes()
            } else {
                anchor_lang::solana_program::keccak::hashv(&[p, &computed_hash]).to_bytes()
            };
        }
        require!(computed_hash == distributor.merkle_root, ErrorCode::InvalidProof);

        // 3. Transférer les USDC du Vault vers l'investisseur
        let seeds = &[
            b"merkle_distributor".as_ref(),
            &[distributor.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.claimant_token_account.to_account_info(),
            authority: ctx.accounts.distributor.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        token::transfer(cpi_ctx, amount)?;

        // 4. Marquer comme réclamé pour empêcher le double-spend
        let claim_state = &mut ctx.accounts.claim_state;
        claim_state.has_claimed = true;
        claim_state.amount_claimed = amount;

        distributor.claimed_count += 1;

        Ok(())
    }
}

// --- Comptes ---
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 32 + 32 + 1 + 8)]
    pub distributor: Account<'info, MerkleDistributor>,
    pub vault: Account<'info, TokenAccount>, // Coffre détenant les USDC
    pub mint: Account<'info, token::Mint>,   // Mint USDC
    #[account(mut)]
    pub admin: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut, has_one = usdc_vault)]
    pub distributor: Account<'info, MerkleDistributor>,
    #[account(mut)]
    pub claimant: Signer<'info>,
    #[account(mut, constraint = claimant_token_account.owner == claimant.key())]
    pub claimant_token_account: Account<'info, TokenAccount>,
    pub vault: Account<'info, TokenAccount>,
    /// CHECK: PDA qui stocke l'état de réclamation de l'utilisateur
    #[account(
        init_if_needed,
        payer = claimant,
        space = 8 + 1 + 8,
        seeds = [b"claim", distributor.key().as_ref(), claimant.key().as_ref()],
        bump
    )]
    pub claim_state: Account<'info, ClaimState>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// --- États (State) ---
#[account]
pub struct MerkleDistributor {
    pub merkle_root: [u8; 32],
    pub usdc_vault: Pubkey,
    pub usdc_mint: Pubkey,
    pub bump: u8,
    pub claimed_count: u64,
}

#[account]
pub struct ClaimState {
    pub has_claimed: bool,
    pub amount_claimed: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Cet investisseur a déjà réclamé ses dividendes.")]
    AlreadyClaimed,
    #[msg("La preuve Merkle fournie est invalide.")]
    InvalidProof,
}