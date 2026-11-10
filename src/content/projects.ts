import type { Localized } from '../app/core/i18n/locale';
import type { IconName } from '../app/shared/icon/icon';

/** Kinds of link; each one has its own label and icon on the card. */
export type ProjectLinkKind = 'live' | 'package' | 'source';

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly url: string;
  /** Tells two links of the same kind apart, e.g. the front-end and back-end repositories. */
  readonly part?: Localized<string>;
}

export interface Project {
  /** Stable kebab-case id, used as the card anchor. */
  readonly id: string;
  readonly name: string;
  readonly icon: IconName;
  readonly summary: Localized<string>;
  readonly stack: readonly string[];
  readonly links: readonly ProjectLink[];
  /** Shown on the home page; keep it to three. */
  readonly featured?: boolean;
  readonly inProgress?: boolean;
  /** The older study project this one rewrites. */
  readonly rewriteOf?: { readonly name: string; readonly year: number; readonly url: string };
}

const GITHUB = 'https://github.com/brunogutierre';

/** Listed in this order, finished projects first. */
export const PROJECTS: readonly Project[] = [
  {
    id: 'advanced-sudoku',
    name: 'Advanced Sudoku',
    icon: 'grid',
    featured: true,
    summary: {
      en: 'A Sudoku for the browser that works offline, in four languages. Puzzles are graded by the techniques they need, and hints teach the next logical move.',
      'pt-BR':
        'Um Sudoku para o navegador que funciona offline, em quatro idiomas. Os jogos são graduados pelas técnicas que exigem, e as dicas ensinam o próximo passo lógico.',
      fr: 'Un Sudoku pour le navigateur qui fonctionne hors ligne, en quatre langues. Les grilles sont classées selon les techniques qu’elles demandent, et les indices enseignent le prochain coup logique.',
    },
    stack: ['Angular 22', 'Signals', 'Web Worker', 'PWA', 'Vitest', 'Playwright'],
    links: [
      { kind: 'live', url: 'https://brunogutierre.github.io/AdvancedSudoku/' },
      { kind: 'source', url: `${GITHUB}/AdvancedSudoku` },
    ],
    rewriteOf: { name: 'sudoku', year: 2021, url: `${GITHUB}/sudoku` },
  },
  {
    id: 'pokerol',
    name: 'PokeRol',
    icon: 'book-open',
    featured: true,
    summary: {
      en: 'A multilingual Pokédex. The Angular app talks only to a Spring Boot backend-for-frontend, which turns PokeAPI data into ready-to-render JSON. The free server can take a minute to wake up.',
      'pt-BR':
        'Uma Pokédex multilíngue. O app Angular fala só com um backend-for-frontend em Spring Boot, que transforma os dados da PokeAPI em JSON pronto para exibir. O servidor gratuito pode levar um minuto para acordar.',
      fr: 'Un Pokédex multilingue. L’application Angular ne parle qu’à un backend-for-frontend Spring Boot, qui transforme les données de PokeAPI en JSON prêt à afficher. Le serveur gratuit peut mettre une minute à se réveiller.',
    },
    stack: ['Angular 22', 'Spring Boot 4', 'Java 25', 'Docker', 'Render'],
    links: [
      { kind: 'live', url: 'https://pokerol.onrender.com' },
      { kind: 'source', url: `${GITHUB}/PokeRol` },
    ],
    rewriteOf: { name: 'brunos-pokedex', year: 2021, url: `${GITHUB}/brunos-pokedex` },
  },
  {
    id: 'angular-mapper',
    name: 'AngularMapper',
    icon: 'braces',
    featured: true,
    summary: {
      en: 'A type-safe Angular library that maps backend DTOs to frontend models and back, with RxJS operators and an HTTP interceptor. Published on npm.',
      'pt-BR':
        'Uma biblioteca Angular com tipagem forte que converte DTOs do backend em modelos do frontend e vice-versa, com operadores RxJS e um interceptor HTTP. Publicada no npm.',
      fr: 'Une bibliothèque Angular typée qui convertit les DTO du back-end en modèles front-end et inversement, avec des opérateurs RxJS et un intercepteur HTTP. Publiée sur npm.',
    },
    stack: ['Angular 22', 'TypeScript', 'RxJS', 'npm'],
    links: [
      { kind: 'package', url: 'https://www.npmjs.com/package/@brunogutierre/angular-mapper' },
      { kind: 'source', url: `${GITHUB}/AngularMapper` },
    ],
  },
  {
    id: 'simple-url',
    name: 'SimpleURL',
    icon: 'link',
    summary: {
      en: 'A URL shortener REST API with expiring links, 302 redirects, click statistics and RFC 9457 error responses.',
      'pt-BR':
        'Uma API REST para encurtar URLs, com links que expiram, redirecionamento 302, estatísticas de cliques e erros no formato RFC 9457.',
      fr: 'Une API REST de raccourcissement d’URL, avec des liens qui expirent, des redirections 302, des statistiques de clics et des erreurs au format RFC 9457.',
    },
    stack: ['Java 25', 'Spring Boot 4', 'JPA', 'JUnit'],
    links: [{ kind: 'source', url: `${GITHUB}/SimpleURL` }],
  },
  {
    id: 'personal-site',
    name: 'brunogutierre.github.io',
    icon: 'globe',
    summary: {
      en: 'This site. Angular prerenders it into static pages in three languages, and GitHub Actions deploys it with checks that keep the Android app links file online.',
      'pt-BR':
        'Este site. O Angular o pré-renderiza em páginas estáticas em três idiomas, e o GitHub Actions faz o deploy com verificações que mantêm no ar o arquivo de links do app Android.',
      fr: 'Ce site. Angular le pré-rend en pages statiques en trois langues, et GitHub Actions le déploie avec des vérifications qui gardent en ligne le fichier de liens de l’application Android.',
    },
    stack: ['Angular 22', 'Prerendering', '@angular/localize', 'GitHub Actions'],
    links: [{ kind: 'source', url: `${GITHUB}/brunogutierre.github.io` }],
  },
  {
    id: 'bitpocket',
    name: 'BitPocket',
    icon: 'wallet',
    summary: {
      en: 'A study Bitcoin wallet for Android with layered security: biometric signing, spending limits, a miniscript vault with inheritance, a duress PIN that opens a decoy wallet, and coin control. Test networks only.',
      'pt-BR':
        'Uma carteira Bitcoin de estudo para Android com segurança em camadas: assinatura biométrica, limites de gasto, um cofre miniscript com herança, um PIN de coação que abre uma carteira de fachada e controle de moedas. Só em redes de teste.',
      fr: 'Un portefeuille Bitcoin d’étude pour Android avec une sécurité en couches : signature biométrique, limites de dépense, un coffre miniscript avec héritage, un code PIN de contrainte qui ouvre un portefeuille leurre et contrôle des pièces. Réseaux de test uniquement.',
    },
    stack: ['Kotlin', 'Jetpack Compose', 'Bitcoin Dev Kit', 'Miniscript', 'Android Keystore'],
    links: [{ kind: 'source', url: `${GITHUB}/BitPocket` }],
  },
  {
    id: 'mtg-to-rpg',
    name: 'MTG to RPG',
    icon: 'dices',
    inProgress: true,
    summary: {
      en: 'Turns Magic: The Gathering cards into tabletop RPG stats, with an Angular front end and a Python API that uses Gemini for the conversion.',
      'pt-BR':
        'Converte cartas de Magic: The Gathering em fichas de RPG de mesa, com um front-end Angular e uma API Python que usa o Gemini na conversão.',
      fr: 'Convertit les cartes de Magic : l’Assemblée en fiches de jeu de rôle, avec un front-end Angular et une API Python qui utilise Gemini pour la conversion.',
    },
    stack: ['Angular 22', 'Python', 'FastAPI', 'Gemini', 'MongoDB'],
    links: [
      {
        kind: 'source',
        url: `${GITHUB}/MTGtoRPGFront`,
        part: { en: 'front end', 'pt-BR': 'front-end', fr: 'front-end' },
      },
      {
        kind: 'source',
        url: `${GITHUB}/MTGtoRPGBack`,
        part: { en: 'back end', 'pt-BR': 'back-end', fr: 'back-end' },
      },
    ],
  },
];

/** The Android version of Advanced Sudoku, published by Alt Cozy Games. */
export const ANDROID_APP = {
  name: 'Advanced Sudoku',
  url: 'https://altcozygames.com/sudoku',
  summary: {
    en: 'Advanced Sudoku grew into an Android app, with rule variants, seasonal events and an Academy of techniques.',
    'pt-BR':
      'O Advanced Sudoku virou um app para Android, com variantes de regras, eventos sazonais e uma Academia de técnicas.',
    fr: 'Advanced Sudoku est devenu une application Android, avec des variantes de règles, des événements saisonniers et une Académie des techniques.',
  } satisfies Localized<string>,
} as const;
