// src/views/ComplianceView.tsx
import React from 'react';

export default function ComplianceView() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white text-gray-800 rounded-2xl shadow-lg border border-teal-100">
      <div className="mb-8 border-b border-teal-200 pb-4">
        <h1 className="text-3xl font-bold text-teal-700">Centre de Conformité & Légal</h1>
        <p className="text-sm text-gray-500 mt-2">Dernière mise à jour : 25 novembre 2026</p>
      </div>

      {/* 1. Politique de Remboursement (Exigence critique Paddle) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Politique de Remboursement
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>Chez <strong>MAISON MARK KANICH / KIIS GLOBAL</strong>, nous nous engageons à la satisfaction de nos clients. Conformément aux standards de notre partenaire de paiement sécurisé (Paddle), vous disposez d'un droit de rétractation.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Délai :</strong> 14 jours calendaires à compter de la date d'achat de votre abonnement SaaS.</li>
            <li><strong>Procédure :</strong> Envoyez un email à <a href="mailto:contact@markkanich.com" className="text-teal-600 underline">contact@markkanich.com</a> avec votre numéro de commande Paddle (format : ORD-XXXXX-XXXXX).</li>
            <li><strong>Traitement :</strong> Les demandes éligibles sont remboursées sous 5 à 10 jours ouvrés via le moyen de paiement d'origine.</li>
            <li><strong>Exceptions :</strong> Les frais de conversion de devise ou frais bancaires (SWIFT) ne sont pas remboursables.</li>
          </ul>
        </div>
      </section>

      {/* 2. Informations Légales */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-teal-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          Informations Légales
        </h2>
        <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
          <p className="font-semibold text-teal-800 mb-2">Éditeur du service (Stipulor / ImmoScale AI) :</p>
          <address className="not-italic text-gray-700 space-y-1">
            <p><strong>MAISON MARK KANICH / KIIS GLOBAL</strong></p>
            <p>📍 145-146 Sideci Iroko, Yopougon, Abidjan, Côte d'Ivoire</p>
            <p>📧 contact@markkanich.com | 📞 +225 07 15 94 60 56</p>
            <p>🌐 www.markkanich.com</p>
          </address>
        </div>
      </section>

      {/* 3. Documents Téléchargeables (Exigence Paddle pour les offres Enterprise) */}
      <section>
        <h2 className="text-xl font-semibold text-teal-600 mb-4">Documents Téléchargeables</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/documents/CGV_Stipulor.pdf" className="px-4 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition flex items-center gap-2 shadow-sm">
            📄 Conditions Générales de Vente (PDF)
          </a>
          <a href="/documents/Grille_Tarifs_Enterprise.pdf" className="px-4 py-2 bg-white border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 transition flex items-center gap-2 shadow-sm">
            📊 Grille Tarifs Enterprise (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}