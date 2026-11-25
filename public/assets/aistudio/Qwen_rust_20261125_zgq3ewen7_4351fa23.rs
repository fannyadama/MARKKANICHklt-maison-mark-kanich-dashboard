// programs/klt-card-escrow/src/lib.rs
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("VOTRE_PROGRAM_ID_ICI"); // Remplacer après `anchor build`

// Adresse officielle du Mint $KLT (À mettre à jour après le déploiement du token)
const KLT_MINT_ADDRESS: &str = "VOTRE_ADRESSE_MINT_KLT_ICI";

#[program]
pub mod klt_card_escrow {
    use super::*;

    // 1. DÉPÔT : L'utilisateur verrouille des $KLT pour recharger sa carte virtuelle
    pub fn deposit_klt(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        // Vérification que le mint est bien le $KLT officiel
        require!(
            ctx.accounts.mint.key().to_string() == KLT_MINT_ADDRESS,
            ErrorCode::InvalidMint
        );

        // Transfert des $KLT du compte de l'utilisateur vers le coffre-fort (Vault) du programme
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Émission d'un événement pour que le backend écoute et crédite le solde virtuel
        emit!(KltDeposited {
            user: ctx.accounts.user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // 2. RETRAIT : L'utilisateur récupère ses $KLT (ex: carte clôturée ou solde non utilisé)
    pub fn withdraw_klt(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(
            ctx.accounts.vault_token_account.amount >= amount,
            ErrorCode::InsufficientFunds
        );

        // Le programme signe le transfert depuis le Vault vers l'utilisateur
        let seeds = &[
            b"vault",
            ctx.accounts.user.key().as_ref(),
            &[ctx.bumps.vault],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        token::transfer(cpi_ctx, amount)?;

        emit!(KltWithdrawn {
            user: ctx.accounts.user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// --- Comptes pour le Dépôt ---
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Le Vault est un PDA unique par utilisateur : seed = "vault" + pubkey utilisateur
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_token_account.mint == mint.key()
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub mint: Account<'info, token::Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// --- Comptes pour le Retrait ---
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_token_account.mint == mint.key()
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub mint: Account<'info, token::Mint>,
    pub token_program: Program<'info, Token>,
}

// --- Événements (écoutés par le backend via WebSocket ou indexeur) ---
#[event]
pub struct KltDeposited {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct KltWithdrawn {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Le montant doit être supérieur à zéro.")]
    InvalidAmount,
    #[msg("Le mint du token n'est pas le $KLT officiel.")]
    InvalidMint,
    #[msg("Fonds insuffisants dans le coffre-fort.")]
    InsufficientFunds,
}