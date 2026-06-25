/**
 * Tests unitaires du composant React VibeCard.
 *
 * Couvre la compétence CP2 (interfaces utilisateur) et CP9 (plan de tests).
 * Fonctionnalité testée : affichage et interaction de la carte d'une vibe.
 *
 * Outil : Jest + React Testing Library.
 * Environnement : jsdom (navigateur simulé).
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VibeCard from './VibeCard';

// ──────────────────────────────────────────
// Données de test (jeu d'essai)
// ──────────────────────────────────────────

/** Vibe nominale utilisée dans la plupart des tests */
const mockVibe = {
    id: 1,
    label: 'Chill',
    icon: {
        imagePath: 'chill-icon.png',
    },
    criteria: {
        mood: 5,
        tone: 3,
        stress: 2,
    },
};

/** Vibe avec label long (cas limite) */
const mockVibeLongLabel = {
    ...mockVibe,
    id: 2,
    label: 'Une ambiance très longue pour tester le rendu du composant avec beaucoup de texte',
};

/** Vibe sans icône (cas limite) */
const mockVibeNoIcon = {
    ...mockVibe,
    id: 3,
    label: 'Sans icône',
    icon: null,
};

// ──────────────────────────────────────────
// Helper de rendu
// ──────────────────────────────────────────

/**
 * Rendu du composant dans un MemoryRouter
 * (nécessaire car le composant utilise useNavigate / Link).
 */
const renderVibeCard = (vibe = mockVibe, props = {}) => {
    return render(
        <MemoryRouter>
            <VibeCard vibe={vibe} {...props} />
        </MemoryRouter>
    );
};

// ──────────────────────────────────────────
// Tests
// ──────────────────────────────────────────

describe('VibeCard — Tests unitaires', () => {

    // ── Groupe 1 : Rendu nominal ──

    describe('Rendu nominal', () => {
        /**
         * @test
         * CAS NOMINAL : Le label de la vibe est affiché.
         * Données en entrée : vibe avec label "Chill".
         * Résultat attendu : texte "Chill" visible dans le composant.
         */
        test('affiche le label de la vibe', () => {
            renderVibeCard();
            expect(screen.getByText('Chill')).toBeInTheDocument();
        });

        /**
         * @test
         * CAS NOMINAL : L'icône de la vibe est affichée avec le bon alt.
         * Données en entrée : vibe avec icon.imagePath "chill-icon.png".
         * Résultat attendu : image présente dans le DOM.
         */
        test('affiche l\'icône de la vibe', () => {
            renderVibeCard();
            const img = screen.getByRole('img');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', expect.stringContaining('chill-icon.png'));
        });

        /**
         * @test
         * CAS NOMINAL : Le composant se monte sans erreur.
         * Données en entrée : vibe nominale complète.
         * Résultat attendu : le composant est présent dans le DOM.
         */
        test('le composant se monte sans erreur', () => {
            const { container } = renderVibeCard();
            expect(container.firstChild).not.toBeNull();
        });
    });

    // ── Groupe 2 : Cas limites ──

    describe('Cas limites', () => {
        /**
         * @test
         * CAS LIMITE : Vibe avec un label très long.
         * Données en entrée : label de plus de 80 caractères.
         * Résultat attendu : le texte est quand même rendu (pas de crash).
         */
        test('affiche correctement un label très long', () => {
            renderVibeCard(mockVibeLongLabel);
            expect(screen.getByText(mockVibeLongLabel.label)).toBeInTheDocument();
        });

        /**
         * @test
         * CAS LIMITE : Vibe sans icône.
         * Données en entrée : icon = null.
         * Résultat attendu : le composant ne plante pas.
         */
        test('ne plante pas si l\'icône est absente', () => {
            expect(() => renderVibeCard(mockVibeNoIcon)).not.toThrow();
        });
    });

    // ── Groupe 3 : Interactions ──

    describe('Interactions utilisateur', () => {
        /**
         * @test
         * CAS NOMINAL : Un clic sur la carte ne provoque pas d'erreur.
         * VibeCard gère la navigation en interne via useNavigate (pas de prop onClick).
         * Données en entrée : clic sur le conteneur de la carte.
         * Résultat attendu : aucune exception levée, le composant reste dans le DOM.
         */
        test('un clic sur la carte ne provoque pas d\'erreur', () => {
            renderVibeCard();

            // Le composant utilise useNavigate en interne — pas de prop onClick externe.
            // On vérifie que le clic ne plante pas et que le composant est toujours là.
            const card = screen.getByText('Chill').closest('div');
            expect(() => fireEvent.click(card)).not.toThrow();
            expect(screen.getByText('Chill')).toBeInTheDocument();
        });
    });

    // ── Groupe 4 : Snapshots ──

    describe('Snapshot', () => {
        /**
         * @test
         * Snapshot de référence du composant VibeCard.
         * Permet la détection de régressions visuelles (non-régression).
         * Note : générer le snapshot initial avec : npm test -- -u
         */
        test('correspond au snapshot de référence', () => {
            const { container } = renderVibeCard();
            // En CI : le snapshot de référence doit être commité dans le repo.
            // Pour créer/mettre à jour : npm test -- -u
            expect(container).toMatchSnapshot();
        });
    });
});