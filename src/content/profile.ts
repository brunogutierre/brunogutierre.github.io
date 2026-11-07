import type { Localized } from '../app/core/i18n/locale';

/** A number worth a glance, with what it counts. */
export interface Highlight {
  readonly value: string;
  readonly label: Localized<string>;
}

export interface Profile {
  readonly name: string;
  /** One line under the name, in the home hero. */
  readonly role: Localized<string>;
  /** City, on the printed CV. */
  readonly location: Localized<string>;
  /** Paragraphs of the About section. */
  readonly about: Localized<readonly string[]>;
  readonly highlights: readonly Highlight[];
  readonly links: {
    readonly github: string;
    readonly linkedin: string;
    readonly email: string;
  };
}

export const PROFILE: Profile = {
  name: 'Bruno Gutierre',
  role: {
    en: 'Senior software engineer focused on Angular, design systems and Java back ends.',
    'pt-BR': 'Engenheiro de software sênior, com foco em Angular, design systems e back-ends Java.',
    fr: 'Ingénieur logiciel senior, spécialisé en Angular, en design systems et en back-ends Java.',
  },
  location: {
    en: 'Montreal, QC, Canada',
    'pt-BR': 'Montreal, QC, Canadá',
    fr: 'Montréal (Québec), Canada',
  },
  about: {
    en: [
      'I’m a senior software engineer based in Montreal, Canada, with more than 17 years of experience building software for healthcare, government, education and mapping. I work across the stack, with Angular and TypeScript on the front end and Java and Spring Boot on the back end.',
      'Since 2022, I have focused on frontend architecture and design systems at scale. I helped move a Canadian healthcare platform from a monolith to micro-frontends and build a design system of more than 50 Web Components. Before that, I worked on Brazilian government services used by millions of people, including the income tax platform.',
      'Outside work, I build small open-source projects to learn new tools and to show how I work.',
    ],
    'pt-BR': [
      'Sou engenheiro de software sênior em Montreal, no Canadá, e há mais de 17 anos desenvolvo software para saúde, governo, educação e mapas. Trabalho no front e no back, com Angular e TypeScript de um lado e Java e Spring Boot do outro.',
      'Desde 2022, meu foco é arquitetura frontend e design systems em escala. Ajudei a levar uma plataforma de saúde canadense de um monólito para micro-frontends e a construir um design system com mais de 50 Web Components. Antes disso, trabalhei em serviços do governo federal usados por milhões de brasileiros, incluindo a plataforma do Imposto de Renda.',
      'Fora do trabalho, faço pequenos projetos open source para aprender ferramentas novas e mostrar como trabalho.',
    ],
    fr: [
      'Je suis ingénieur logiciel senior à Montréal, au Canada, et je développe des logiciels depuis plus de 17 ans pour la santé, le secteur public, l’éducation et la cartographie. Je travaille sur toute la pile, avec Angular et TypeScript côté front-end, Java et Spring Boot côté back-end.',
      'Depuis 2022, je me consacre à l’architecture front-end et aux design systems à grande échelle. J’ai contribué à faire passer une plateforme de santé canadienne d’un monolithe à des micro-frontends et à bâtir un design system de plus de 50 Web Components. Auparavant, j’ai travaillé sur des services publics brésiliens utilisés par des millions de personnes, dont la plateforme de l’impôt sur le revenu.',
      'En dehors du travail, je réalise de petits projets open source pour apprendre de nouveaux outils et montrer ma façon de travailler.',
    ],
  },
  highlights: [
    {
      value: '17+',
      label: {
        en: 'years building software',
        'pt-BR': 'anos desenvolvendo software',
        fr: 'ans à développer des logiciels',
      },
    },
    {
      value: '50+',
      label: {
        en: 'Web Components in a design system shared by three product teams',
        'pt-BR': 'Web Components em um design system usado por três times de produto',
        fr: 'Web Components dans un design system partagé par trois équipes produit',
      },
    },
    {
      value: '~200',
      label: {
        en: 'public schools on an education platform I helped build',
        'pt-BR': 'escolas públicas em uma plataforma de educação que ajudei a construir',
        fr: 'écoles publiques sur une plateforme éducative que j’ai aidé à construire',
      },
    },
  ],
  links: {
    github: 'https://github.com/brunogutierre',
    linkedin: 'https://www.linkedin.com/in/bruno-gutierre/',
    email: 'brunorg@gmail.com',
  },
};
