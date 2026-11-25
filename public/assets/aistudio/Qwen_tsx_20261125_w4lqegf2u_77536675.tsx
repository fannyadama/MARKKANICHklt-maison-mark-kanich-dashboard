// src/views/ComplianceView.tsx
import React from 'react';

export default function ComplianceView() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-klt-paper text-gray-800 rounded-2xl shadow-card">
      {/* En-tête */}
      <div className="mb-8 border-b border-klt-teal-300 pb-4">
        <h1 className="text-3xl font-bold text-klt-teal-700">Centre de Conformité & Légal</h1>
        <p className="text-sm text-gray-500 mt-2">Dernière mise à jour : 25 novembre 2026</p>
      </div>

      {/* Section 1 : Politique de Remboursement (Exigence critique Paddle) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-klt-teal-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klt-orange-500"></span>
          Politique de Remboursement
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Chez <strong>MAISON MARK KANICH / KIIS GLOBAL</strong>, nous nous engageons à la satisfaction de nos clients. 
            Conformément aux standards de notre partenaire de paiement sécurisé (Paddle), vous disposez d'un droit de rétractation.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Délai :</strong> 14 jours calendaires à compter de la date d'achat de votre abonnement SaaS.</li>
            <li><strong>Procédure :</strong> Envoyez un email à <a href="mailto:contact@markkanich.com" className="text-klt-teal-600 underline">contact@markkanich.com</a> avec votre numéro de commande Paddle (format : ORD-XXXXX-XXXXX).</li>
            <li><strong>Traitement :</strong> Les demandes éligibles sont remboursées sous 5 à 10 jours ouvrés via le moyen de paiement d'origine.</li>
            <li><strong>Exceptions :</strong> Les frais de conversion de devise ou frais bancaires (SWIFT) ne sont pas remboursables.</li>
          </ul>
        </div>
      </section>

      {/* Section 2 : Conditions Générales & Entité Légale */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-klt-teal-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klt-gold-400"></span>
          Informations Légales
        </h2>
        <div className="bg-klt-teal-50 p-6 rounded-xl border border-klt-teal-200">
          <p className="font-semibold text-klt-teal-800 mb-2">Éditeur du service (Stipulor / ImmoScale AI) :</p>
          <address className="not-italic text-gray-700 space-y-1">
            <p><strong>MAISON MARK KANICH / KIIS GLOBAL</strong></p>
            <p>📍 145-146 Sideci Iroko, Yopougon, Abidjan, Côte d'Ivoire</p>
            <p>📧 contact@markkanich.com | 📞 +225 07 15 94 60 56</p>
            <p>🌐 www.markkanich.com</p>
          </address>
        </div>
      </section>

      {/* Section 3 : Liens utiles */}
      <section>
        <h2 className="text-xl font-semibold text-klt-teal-600 mb-4">Documents Téléchargeables</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/documents/CGV_Stipulor.pdf" className="px-4 py-2 bg-white border border-klt-teal-300 text-klt-teal-700 rounded-lg hover:bg-klt-teal-50 transition flex items-center gap-2">
            📄 Conditions Générales de Vente (PDF)
          </a>
          <a href="/documents/Grille_Tarifs_Enterprise.pdf" className="px-4 py-2 bg-white border border-klt-teal-300 text-klt-teal-700 rounded-lg hover:bg-klt-teal-50 transition flex items-center gap-2">
            📊 Grille Tarifs Enterprise (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}