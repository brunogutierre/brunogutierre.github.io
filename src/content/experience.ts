import type { Localized } from '../app/core/i18n/locale';

/** `YYYY-MM`, or `YYYY` when only the year matters. */
export type YearMonth = `${number}` | `${number}-${number}`;

export interface Job {
  readonly id: string;
  readonly role: Localized<string>;
  readonly company: string;
  /** What the company is, when its name alone says little. */
  readonly companyNote?: Localized<string>;
  readonly start: YearMonth;
  readonly end: YearMonth;
  readonly achievements: Localized<readonly string[]>;
  /** Technology names: the same in every language. */
  readonly stack: readonly string[];
}

export interface SkillGroup {
  readonly label: Localized<string>;
  readonly skills: readonly string[];
}

export interface Degree {
  readonly title: Localized<string>;
  readonly school: Localized<string>;
  readonly start: YearMonth;
  readonly end: YearMonth;
}

export interface SpokenLanguage {
  readonly name: Localized<string>;
  readonly level: Localized<string>;
}

/** The CV summary: the lead of the experience page. */
export const CV_SUMMARY: Localized<string> = {
  en: 'Senior software engineer with 17+ years of experience across full-stack web development and enterprise system architecture, spanning healthcare, government, education, and geospatial domains. Full-stack background in Angular/TypeScript frontend and Java/Spring Boot backend, with recent specialization (2022–2026) in frontend architecture and design systems at scale. Track record modernizing legacy platforms, building reusable design systems, and delivering applications used by thousands to millions of end users. Strong collaborator in Agile teams, with hands-on experience in microservices, reactive state management, and automated testing.',
  'pt-BR':
    'Engenheiro de software sênior com mais de 17 anos de experiência em desenvolvimento web full-stack e arquitetura de sistemas corporativos, nas áreas de saúde, governo, educação e geoprocessamento. Experiência full-stack com Angular/TypeScript no frontend e Java/Spring Boot no backend, com especialização recente (2022–2026) em arquitetura frontend e design systems em escala. Histórico de modernização de plataformas legadas, criação de design systems reutilizáveis e entrega de aplicações usadas por milhares a milhões de pessoas. Colaborador ativo em times ágeis, com experiência prática em microsserviços, gerenciamento de estado reativo e testes automatizados.',
  fr: 'Ingénieur logiciel senior cumulant plus de 17 ans d’expérience en développement web full-stack et en architecture de systèmes d’entreprise, dans les domaines de la santé, du secteur public, de l’éducation et de la géomatique. Expérience full-stack en Angular/TypeScript côté front-end et en Java/Spring Boot côté back-end, avec une spécialisation récente (2022–2026) en architecture front-end et en design systems à grande échelle. Parcours marqué par la modernisation de plateformes existantes, la création de design systems réutilisables et la livraison d’applications utilisées par des milliers, voire des millions de personnes. Solide expérience du travail en équipe agile, des microservices, de la gestion d’état réactive et des tests automatisés.',
};

/** Newest first. */
export const JOBS: readonly Job[] = [
  {
    id: 'petal',
    role: {
      en: 'Senior Frontend Developer',
      'pt-BR': 'Desenvolvedor Frontend Sênior',
      fr: 'Développeur front-end senior',
    },
    company: 'Petal',
    start: '2022-09',
    end: '2026-05',
    achievements: {
      en: [
        'Contributed to the evolution of healthcare platforms used daily by thousands of healthcare professionals and administrative staff across Canada.',
        'Played a key role in modernizing the frontend architecture, contributing to the transition from a monolithic application model to a scalable micro-frontend ecosystem.',
        'Helped design and implement an enterprise Design System adopted across three major product teams, delivering more than 50 reusable Web Components and improving consistency, maintainability, and development efficiency.',
        'Adopted modern Angular patterns — Signals, standalone components, and the new control flow syntax (@if/@for) — to simplify reactivity and reduce boilerplate across the design system and core scheduling features.',
        'Collaborated on architectural decisions, solution design, effort estimation, and peer code reviews, helping maintain high engineering standards across multiple teams.',
        'Developed complex Angular and NgRx features supporting critical scheduling and workflow management processes in healthcare environments.',
        'Contributed to maintaining automated testing standards exceeding 90% code coverage through Cypress-based end-to-end testing and quality-focused development practices.',
        'Used Cursor AI extensively for test generation, documentation, code analysis, and validation, improving development speed and code quality.',
        'Improved application reliability and production visibility through proactive monitoring and issue detection using Sentry.',
      ],
      'pt-BR': [
        'Contribuí para a evolução de plataformas de saúde usadas diariamente por milhares de profissionais de saúde e equipes administrativas em todo o Canadá.',
        'Tive papel central na modernização da arquitetura frontend, contribuindo para a transição de uma aplicação monolítica para um ecossistema escalável de micro-frontends.',
        'Ajudei a projetar e implementar um design system corporativo adotado por três grandes times de produto, com mais de 50 Web Components reutilizáveis, melhorando a consistência, a manutenção e a produtividade do desenvolvimento.',
        'Adotei padrões modernos do Angular — Signals, componentes standalone e a nova sintaxe de control flow (@if/@for) — para simplificar a reatividade e reduzir código repetitivo no design system e nas principais funcionalidades de agendamento.',
        'Colaborei em decisões de arquitetura, desenho de soluções, estimativas de esforço e revisões de código entre pares, ajudando a manter padrões altos de engenharia em vários times.',
        'Desenvolvi funcionalidades complexas com Angular e NgRx para processos críticos de agendamento e gestão de fluxos de trabalho em ambientes de saúde.',
        'Contribuí para manter padrões de testes automatizados acima de 90% de cobertura de código, com testes end-to-end em Cypress e práticas de desenvolvimento focadas em qualidade.',
        'Usei o Cursor AI extensivamente para gerar testes, documentação, análise e validação de código, aumentando a velocidade de desenvolvimento e a qualidade do código.',
        'Melhorei a confiabilidade das aplicações e a visibilidade em produção com monitoramento proativo e detecção de problemas usando o Sentry.',
      ],
      fr: [
        'Contribution à l’évolution de plateformes de santé utilisées chaque jour par des milliers de professionnels de la santé et d’employés administratifs partout au Canada.',
        'Rôle clé dans la modernisation de l’architecture front-end et dans la transition d’une application monolithique vers un écosystème de micro-frontends évolutif.',
        'Participation à la conception et à la mise en œuvre d’un design system d’entreprise adopté par trois grandes équipes produit : plus de 50 Web Components réutilisables, pour plus de cohérence, une maintenance plus simple et un développement plus efficace.',
        'Adoption des patterns modernes d’Angular — Signals, composants standalone et nouvelle syntaxe de control flow (@if/@for) — pour simplifier la réactivité et réduire le code répétitif dans le design system et les principales fonctionnalités de planification.',
        'Participation aux décisions d’architecture, à la conception de solutions, à l’estimation des efforts et aux revues de code entre pairs, pour maintenir des standards d’ingénierie élevés dans plusieurs équipes.',
        'Développement de fonctionnalités complexes en Angular et NgRx pour des processus critiques de planification et de gestion des flux de travail en milieu de santé.',
        'Maintien de standards de tests automatisés au-delà de 90 % de couverture de code, avec des tests de bout en bout Cypress et des pratiques de développement axées sur la qualité.',
        'Utilisation intensive de Cursor AI pour générer des tests, rédiger la documentation, analyser et valider le code, ce qui a accéléré le développement et amélioré la qualité du code.',
        'Amélioration de la fiabilité des applications et de la visibilité en production grâce à une surveillance proactive et à la détection des incidents avec Sentry.',
      ],
    },
    stack: [
      'Angular',
      'TypeScript',
      'NgRx',
      'RxJS',
      'StencilJS',
      'Web Components',
      'Design Tokens',
      'Nx Monorepo',
      'Cypress',
      'Sentry',
      'GitLab CI',
      'Cursor AI',
      'Git',
    ],
  },
  {
    id: 'serpro',
    role: {
      en: 'Systems Analyst / Software Engineer',
      'pt-BR': 'Analista de Sistemas / Engenheiro de Software',
      fr: 'Analyste de systèmes / Ingénieur logiciel',
    },
    company: 'SERPRO',
    companyNote: {
      en: 'Brazilian Federal Data Processing Service',
      'pt-BR': 'Serviço Federal de Processamento de Dados',
      fr: 'Service fédéral de traitement des données du Brésil',
    },
    start: '2015',
    end: '2022',
    achievements: {
      en: [
        'Developed and modernized mission-critical government systems serving millions of Brazilian citizens and thousands of federal employees.',
        'Contributed to the modernization of the “Meu Imposto de Renda” platform, improving accessibility and usability for one of Brazil’s most widely used citizen-facing government services.',
        'Designed and implemented Angular-based web applications and mobile solutions supporting income tax consultation, reporting, and declaration management processes.',
        'Built secure REST APIs and backend services using Java and Spring Boot, integrating enterprise applications with large-scale database and mainframe environments.',
        'Participated in Agile teams of approximately 15 developers delivering high-availability public sector solutions under strict security and compliance requirements.',
        'Contributed to migrating legacy government applications toward modern web architectures, improving maintainability, responsiveness, and long-term scalability.',
        'Developed cloud-ready microservices that reduced system dependencies and facilitated incremental modernization of legacy federal platforms.',
      ],
      'pt-BR': [
        'Desenvolvi e modernizei sistemas governamentais de missão crítica que atendem milhões de cidadãos brasileiros e milhares de servidores federais.',
        'Contribuí para a modernização da plataforma “Meu Imposto de Renda”, melhorando a acessibilidade e a usabilidade de um dos serviços públicos mais usados pelos cidadãos brasileiros.',
        'Projetei e implementei aplicações web em Angular e soluções mobile para consulta, relatórios e gestão de declarações do Imposto de Renda.',
        'Construí APIs REST e serviços de backend seguros com Java e Spring Boot, integrando aplicações corporativas a ambientes de banco de dados e mainframe de grande porte.',
        'Participei de times ágeis de cerca de 15 desenvolvedores, entregando soluções de alta disponibilidade para o setor público sob requisitos rígidos de segurança e conformidade.',
        'Contribuí para migrar aplicações governamentais legadas para arquiteturas web modernas, melhorando a manutenção, o tempo de resposta e a escalabilidade a longo prazo.',
        'Desenvolvi microsserviços prontos para a nuvem que reduziram dependências entre sistemas e facilitaram a modernização gradual de plataformas federais legadas.',
      ],
      fr: [
        'Développement et modernisation de systèmes gouvernementaux critiques au service de millions de citoyens brésiliens et de milliers de fonctionnaires fédéraux.',
        'Contribution à la modernisation de la plateforme « Meu Imposto de Renda » (déclaration de revenus), pour améliorer l’accessibilité et l’ergonomie de l’un des services publics les plus utilisés par les Brésiliens.',
        'Conception et réalisation d’applications web Angular et de solutions mobiles pour la consultation, le suivi et la gestion des déclarations de revenus.',
        'Création d’API REST et de services back-end sécurisés en Java et Spring Boot, intégrant des applications d’entreprise à des environnements de bases de données et de mainframe à grande échelle.',
        'Travail au sein d’équipes agiles d’environ 15 développeurs, livrant des solutions à haute disponibilité pour le secteur public sous des exigences strictes de sécurité et de conformité.',
        'Contribution à la migration d’applications gouvernementales existantes vers des architectures web modernes, pour une maintenance plus simple, une meilleure réactivité et une évolutivité à long terme.',
        'Développement de microservices prêts pour l’infonuagique qui ont réduit les dépendances entre systèmes et facilité la modernisation progressive de plateformes fédérales existantes.',
      ],
    },
    stack: [
      'Angular',
      'AngularJS',
      'TypeScript',
      'Java',
      'Spring Boot',
      'J2EE',
      'Ionic',
      'PostgreSQL',
      'Jenkins',
      'Cypress',
      'JUnit',
      'Git',
    ],
  },
  {
    id: 'minauro',
    role: {
      en: 'Analyst Programmer',
      'pt-BR': 'Analista Programador',
      fr: 'Analyste-programmeur',
    },
    company: 'Minauro Informática',
    start: '2008',
    end: '2015',
    achievements: {
      en: [
        'Designed and developed education management platforms supporting approximately 200 public schools across multiple municipalities, serving more than 10,000 students, educators, and administrators.',
        'Implemented geospatial mapping and route optimization solutions, integrating OpenStreetMap, Google Maps, and GeoServer to improve school transportation planning for municipal governments.',
        'Developed one of the region’s early hybrid mobile solutions, extending access to educational services across desktop and mobile devices.',
      ],
      'pt-BR': [
        'Projetei e desenvolvi plataformas de gestão educacional para cerca de 200 escolas públicas em vários municípios, atendendo mais de 10.000 alunos, educadores e gestores.',
        'Implementei soluções de mapeamento geoespacial e otimização de rotas, integrando OpenStreetMap, Google Maps e GeoServer para melhorar o planejamento do transporte escolar das prefeituras.',
        'Desenvolvi uma das primeiras soluções mobile híbridas da região, levando os serviços educacionais para computadores e dispositivos móveis.',
      ],
      fr: [
        'Conception et développement de plateformes de gestion scolaire pour environ 200 écoles publiques dans plusieurs municipalités, au service de plus de 10 000 élèves, enseignants et administrateurs.',
        'Mise en œuvre de solutions de cartographie géospatiale et d’optimisation d’itinéraires, intégrant OpenStreetMap, Google Maps et GeoServer pour améliorer la planification du transport scolaire des municipalités.',
        'Développement de l’une des premières solutions mobiles hybrides de la région, donnant accès aux services éducatifs sur ordinateur et sur mobile.',
      ],
    },
    stack: [
      'Java',
      'Struts',
      'Hibernate',
      'JavaScript',
      'HTML5',
      'jQuery',
      'Oracle',
      'Google Maps API',
      'OpenStreetMap',
      'GeoServer',
      'Jenkins',
    ],
  },
];

export const SKILLS: readonly SkillGroup[] = [
  {
    label: { en: 'Frontend', 'pt-BR': 'Frontend', fr: 'Front-end' },
    skills: [
      'Angular (Signals, standalone components, control flow)',
      'TypeScript',
      'JavaScript',
      'RxJS',
      'NgRx',
      'AngularJS',
      'HTML5',
      'CSS3',
      'Sass/SCSS',
      'Web Components',
      'StencilJS',
    ],
  },
  {
    label: { en: 'Backend', 'pt-BR': 'Backend', fr: 'Back-end' },
    skills: ['Java', 'Spring Boot', 'J2EE', 'REST APIs', 'Microservices'],
  },
  {
    label: { en: 'Testing and quality', 'pt-BR': 'Testes e qualidade', fr: 'Tests et qualité' },
    skills: ['Cypress', 'JUnit', 'Jasmine', 'Selenium', 'Sentry'],
  },
  {
    label: {
      en: 'Architecture and DevOps',
      'pt-BR': 'Arquitetura e DevOps',
      fr: 'Architecture et DevOps',
    },
    skills: [
      'Nx monorepos',
      'Design systems',
      'Micro-frontends',
      'Docker',
      'Jenkins',
      'GitLab CI',
      'Git',
    ],
  },
  {
    label: { en: 'Databases', 'pt-BR': 'Bancos de dados', fr: 'Bases de données' },
    skills: ['PostgreSQL', 'Oracle', 'MongoDB'],
  },
  {
    label: { en: 'Other', 'pt-BR': 'Outros', fr: 'Autres' },
    skills: ['GraphQL', 'Node.js'],
  },
];

/** Newest first. */
export const EDUCATION: readonly Degree[] = [
  {
    title: {
      en: 'Postgraduate specialization in software engineering',
      'pt-BR': 'Especialização em Engenharia de Software',
      fr: 'Spécialisation (études supérieures) en génie logiciel',
    },
    school: {
      en: 'Pontifical Catholic University of Paraná (PUCPR)',
      'pt-BR': 'Pontifícia Universidade Católica do Paraná (PUCPR)',
      fr: 'Université pontificale catholique du Paraná (PUCPR)',
    },
    start: '2007',
    end: '2008',
  },
  {
    title: {
      en: 'Bachelor of Computer Science',
      'pt-BR': 'Bacharelado em Ciência da Computação',
      fr: 'Baccalauréat en informatique',
    },
    school: {
      en: 'Federal University of Paraná (UFPR)',
      'pt-BR': 'Universidade Federal do Paraná (UFPR)',
      fr: 'Université fédérale du Paraná (UFPR)',
    },
    start: '2001',
    end: '2006',
  },
];

export const SPOKEN_LANGUAGES: readonly SpokenLanguage[] = [
  {
    name: { en: 'English', 'pt-BR': 'Inglês', fr: 'Anglais' },
    level: {
      en: 'Professional working proficiency',
      'pt-BR': 'Fluência profissional',
      fr: 'Compétence professionnelle',
    },
  },
  {
    name: { en: 'French', 'pt-BR': 'Francês', fr: 'Français' },
    level: {
      en: 'B2 (C1 in reading)',
      'pt-BR': 'B2 (C1 em leitura)',
      fr: 'B2 (C1 en compréhension écrite)',
    },
  },
  {
    name: { en: 'Portuguese', 'pt-BR': 'Português', fr: 'Portugais' },
    level: { en: 'Native', 'pt-BR': 'Nativo', fr: 'Langue maternelle' },
  },
];
