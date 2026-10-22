import sample from '../examples/resume.sample.json' with { type: 'json' };

const localizedSamples = {
  'zh-CN': {
    position: '高级产品经理',
    profile: '<p>拥有将用户研究转化为实用数字产品的产品管理经验，擅长路线图规划、跨职能协作与产品成效衡量。乐于简化复杂流程，帮助团队依据证据做出决策。</p>',
    work: [
      { title: '高级产品经理', employer: '北辰产品工作室', city: '示例市', description: '<p>负责面向小型企业的虚构协作工具套件产品路线图。</p><ul><li><strong>产品探索：</strong>定期开展用户访谈和可用性评估，发现未满足的需求。</li><li><strong>路线图规划：</strong>结合用户影响、交付成本和业务目标确定优先级。</li><li><strong>团队协作：</strong>与设计、工程和客户支持团队共同交付渐进式改进。</li><li><strong>结果衡量：</strong>定义采用率与留存指标，并在每次发布后复盘。</li></ul>' },
      { title: '产品分析师', employer: '远景数字工坊', city: '样例镇', description: '<p>为虚构订阅服务提供产品研究和报告支持。创建数据看板、分析客户反馈，并与设计师合作改进引导流程和账户管理。</p>' }
    ],
    education: { school: '示例设计学院', degree: '交互设计学士', city: '样例镇' },
    languages: [['中文', '母语'], ['英语', '中高级']],
    skills: {
      title: '技能',
      items: [
        ['产品策略', '<p>路线图规划、机会评估、产品定位与结果导向的优先级管理。</p>'],
        ['用户研究', '<p>客户访谈、可用性研究、用户旅程梳理与反馈综合分析。</p>'],
        ['产品分析', '<p>SQL、漏斗分析、实验设计与数据看板。</p>'],
        ['协作沟通', '<ul><li>工作坊引导</li><li>版本规划</li><li>利益相关方沟通</li></ul>']
      ]
    },
    projects: {
      title: '项目经验',
      items: [
        ['工作区新手引导改版', '示例市', '<p>重新设计虚构协作产品的首次使用体验。</p><ul><li>通过访谈和可用性测试梳理设置障碍。</li><li>加入带有明确进度提示的引导清单。</li><li>定义激活里程碑和可重复的实验复盘流程。</li></ul>'],
        ['客户反馈中心', '示例市', '<p>创建用于整理产品反馈的共享工作区。</p><ul><li>汇总客户支持对话与研究访谈中的反馈。</li><li>建立统一标签体系，归纳重复出现的客户需求。</li><li>将机会评审与季度规划衔接。</li></ul>'],
        ['订阅管理门户', '示例市', '<ul><li>设计套餐变更和账单偏好的自助流程。</li><li>与支持团队协作，明确账户状态提示。</li><li>检查关键任务的无障碍体验与错误恢复。</li></ul>'],
        ['产品健康度看板', '样例镇', '<ul><li>定义统一的产品采用率与留存指标。</li><li>构建支持每周产品评审的数据视图。</li><li>记录事件定义，提升跨团队数据一致性。</li></ul>'],
        ['帮助中心信息架构', '样例镇', '<ul><li>围绕常见客户任务重组帮助文档。</li><li>与代表性用户一起验证导航名称。</li><li>为常用文章建立编辑审阅流程。</li></ul>'],
        ['研究资料库试点', '样例镇', '<ul><li>将访谈记录和研究发现整理为可搜索资料库。</li><li>创建用于记录证据和待解问题的模板。</li><li>为产品和设计团队组织知识分享。</li></ul>']
      ]
    }
  },
  en: null,
  ja: {
    position: 'シニアプロダクトマネージャー',
    profile: '<p>ユーザー調査を実用的なデジタルプロダクトに結び付けるプロダクトマネジメント経験があります。ロードマップ策定、部門横断の協業、成果測定を得意とし、根拠に基づく意思決定で複雑な業務をシンプルにします。</p>',
    work: [
      { title: 'シニアプロダクトマネージャー', employer: 'ノーススター・プロダクトスタジオ', city: 'サンプル市', description: '<p>中小企業向けの架空コラボレーションツール群のロードマップを担当。</p><ul><li><strong>プロダクト探索：</strong>定期的なユーザーインタビューとユーザビリティ調査で未充足ニーズを特定。</li><li><strong>ロードマップ：</strong>顧客への効果、開発工数、事業目標を基に優先順位を決定。</li><li><strong>チーム協業：</strong>デザイン、エンジニアリング、サポートと段階的な改善を実現。</li><li><strong>成果測定：</strong>利用率と継続率の指標を定義し、リリース後にレビュー。</li></ul>' },
      { title: 'プロダクトアナリスト', employer: 'ホライズン・デジタルワークショップ', city: 'サンプル町', description: '<p>架空のサブスクリプションサービスで調査とレポートを支援。ダッシュボード作成、顧客フィードバック分析、オンボーディングとアカウント管理の改善に取り組みました。</p>' }
    ],
    education: { school: 'サンプル・デザイン学院', degree: 'インタラクションデザイン学士', city: 'サンプル町' },
    languages: [['日本語', 'ネイティブ'], ['英語', '中上級']],
    skills: { title: 'スキル', items: [['プロダクト戦略', '<p>ロードマップ策定、機会評価、プロダクトポジショニング、成果に基づく優先順位付け。</p>'], ['ユーザー調査', '<p>顧客インタビュー、ユーザビリティ調査、ユーザージャーニー分析、フィードバック統合。</p>'], ['プロダクト分析', '<p>SQL、ファネル分析、実験、ダッシュボード設計。</p>'], ['チーム協業', '<ul><li>ワークショップ進行</li><li>リリース計画</li><li>関係者とのコミュニケーション</li></ul>']] },
    projects: { title: 'プロジェクト経験', items: [['ワークスペース導入体験の改善', 'サンプル市', '<p>架空のコラボレーション製品の初回利用体験を再設計。</p><ul><li>インタビューとユーザビリティテストで初期設定の課題を把握。</li><li>進捗が分かるガイド付きチェックリストを導入。</li><li>アクティベーション指標と実験レビューの手順を整備。</li></ul>'], ['顧客フィードバックハブ', 'サンプル市', '<p>プロダクトフィードバックを整理する共有ワークスペースを作成。</p><ul><li>サポート対応と調査セッションの声を集約。</li><li>繰り返し発生するニーズに一貫したタグを設定。</li><li>機会レビューを四半期計画に接続。</li></ul>'], ['サブスクリプション管理ポータル', 'サンプル市', '<ul><li>プラン変更と請求設定のセルフサービス導線を設計。</li><li>アカウント状態の表示をサポートチームと改善。</li><li>主要タスクのアクセシビリティとエラー復旧を確認。</li></ul>'], ['プロダクト健全性ダッシュボード', 'サンプル町', '<ul><li>利用状況と継続率の共通指標を定義。</li><li>週次レビュー向けのレポート画面を作成。</li><li>チーム間でイベント定義を文書化。</li></ul>'], ['ヘルプセンター情報設計', 'サンプル町', '<ul><li>顧客のタスクを軸にドキュメントを再構成。</li><li>ユーザーとナビゲーションラベルを検証。</li><li>よく使われる記事の編集レビューを整備。</li></ul>'], ['リサーチリポジトリの試行', 'サンプル町', '<ul><li>インタビュー記録と調査結果を検索可能なライブラリに整理。</li><li>根拠と未解決の問いを記録するテンプレートを作成。</li><li>プロダクトとデザインチームの知識共有を促進。</li></ul>']] }
  },
  ko: {
    position: '시니어 프로덕트 매니저',
    profile: '<p>사용자 조사를 실용적인 디지털 제품으로 연결해 온 프로덕트 매니지먼트 경험이 있습니다. 로드맵 기획, 부서 간 협업, 성과 측정에 강점이 있으며 근거 기반 의사결정으로 복잡한 업무를 단순화합니다.</p>',
    work: [
      { title: '시니어 프로덕트 매니저', employer: '노스스타 프로덕트 스튜디오', city: '샘플 시티', description: '<p>중소기업용 가상 협업 도구 제품군의 로드맵을 담당했습니다.</p><ul><li><strong>제품 탐색:</strong> 정기적인 사용자 인터뷰와 사용성 평가로 미충족 요구를 발견했습니다.</li><li><strong>로드맵 기획:</strong> 고객 영향, 개발 노력, 비즈니스 목표를 기준으로 우선순위를 정했습니다.</li><li><strong>팀 협업:</strong> 디자인, 엔지니어링, 고객 지원과 단계적 개선을 진행했습니다.</li><li><strong>성과 측정:</strong> 사용률과 유지율 지표를 정의하고 출시 후 결과를 검토했습니다.</li></ul>' },
      { title: '프로덕트 애널리스트', employer: '호라이즌 디지털 워크숍', city: '샘플 타운', description: '<p>가상의 구독 서비스에서 제품 조사와 리포팅을 지원했습니다. 대시보드를 만들고 고객 피드백을 분석하며 온보딩과 계정 관리 개선에 참여했습니다.</p>' }
    ],
    education: { school: '샘플 디자인 인스티튜트', degree: '인터랙션 디자인 학사', city: '샘플 타운' },
    languages: [['한국어', '모국어'], ['영어', '중상급']],
    skills: { title: '기술', items: [['제품 전략', '<p>로드맵 기획, 기회 평가, 제품 포지셔닝, 성과 중심 우선순위 설정.</p>'], ['사용자 조사', '<p>고객 인터뷰, 사용성 조사, 여정 분석, 피드백 종합.</p>'], ['제품 분석', '<p>SQL, 퍼널 분석, 실험, 대시보드 설계.</p>'], ['협업', '<ul><li>워크숍 진행</li><li>출시 계획</li><li>이해관계자 소통</li></ul>']] },
    projects: { title: '프로젝트 경험', items: [['워크스페이스 온보딩 개선', '샘플 시티', '<p>가상 협업 제품의 첫 사용 경험을 재설계했습니다.</p><ul><li>인터뷰와 사용성 세션으로 설정 과정의 장벽을 파악했습니다.</li><li>진행 상황이 명확한 가이드 체크리스트를 도입했습니다.</li><li>활성화 기준과 반복 가능한 실험 검토 절차를 정의했습니다.</li></ul>'], ['고객 피드백 허브', '샘플 시티', '<p>제품 피드백을 정리하는 공유 작업 공간을 만들었습니다.</p><ul><li>지원 대화와 조사 세션의 피드백을 통합했습니다.</li><li>반복되는 고객 요구를 위한 일관된 태그 체계를 만들었습니다.</li><li>기회 검토를 분기 계획과 연결했습니다.</li></ul>'], ['구독 관리 포털', '샘플 시티', '<ul><li>요금제 변경과 결제 설정을 위한 셀프서비스 흐름을 설계했습니다.</li><li>지원 팀과 계정 상태 메시지를 명확하게 다듬었습니다.</li><li>주요 작업의 접근성과 오류 복구를 검토했습니다.</li></ul>'], ['제품 상태 대시보드', '샘플 타운', '<ul><li>제품 사용과 유지율의 공통 지표를 정의했습니다.</li><li>주간 제품 검토를 위한 보고 화면을 만들었습니다.</li><li>팀 간 일관성을 위해 이벤트 정의를 문서화했습니다.</li></ul>'], ['헬프센터 정보 구조', '샘플 타운', '<ul><li>고객이 자주 수행하는 작업 중심으로 문서를 재구성했습니다.</li><li>대표 사용자를 대상으로 탐색 레이블을 검증했습니다.</li><li>자주 쓰는 문서의 편집 검토 절차를 수립했습니다.</li></ul>'], ['리서치 저장소 파일럿', '샘플 타운', '<ul><li>인터뷰 기록과 조사 결과를 검색 가능한 라이브러리에 정리했습니다.</li><li>근거와 미해결 질문을 기록하는 템플릿을 만들었습니다.</li><li>제품 및 디자인 팀의 지식 공유를 진행했습니다.</li></ul>']] }
  },
  es: {
    position: 'Gerente sénior de producto',
    profile: '<p>Experiencia en gestión de producto, convirtiendo la investigación de clientes en productos digitales prácticos. Especializado en hojas de ruta, colaboración entre equipos y medición de resultados, con foco en simplificar flujos complejos y decidir con datos.</p>',
    work: [
      { title: 'Gerente sénior de producto', employer: 'Estudio de Producto Estrella del Norte', city: 'Ciudad Ejemplo', description: '<p>Responsable de la hoja de ruta de una suite ficticia de colaboración para pequeñas empresas.</p><ul><li><strong>Descubrimiento:</strong> entrevistas periódicas y pruebas de usabilidad para detectar necesidades.</li><li><strong>Planificación:</strong> priorización según impacto en clientes, esfuerzo y objetivos de negocio.</li><li><strong>Colaboración:</strong> mejoras incrementales con diseño, ingeniería y soporte.</li><li><strong>Medición:</strong> definición de métricas de adopción y retención, con revisiones tras cada lanzamiento.</li></ul>' },
      { title: 'Analista de producto', employer: 'Taller Digital Horizonte', city: 'Pueblo Muestra', description: '<p>Apoyo a investigación e informes para un servicio de suscripción ficticio. Creación de paneles, análisis de comentarios y colaboración en mejoras de incorporación y gestión de cuentas.</p>' }
    ],
    education: { school: 'Instituto de Diseño Ejemplo', degree: 'Grado en Diseño de Interacción', city: 'Pueblo Muestra' },
    languages: [['Español', 'Nativo'], ['Inglés', 'Intermedio alto']],
    skills: { title: 'Habilidades', items: [['Estrategia de producto', '<p>Hojas de ruta, evaluación de oportunidades, posicionamiento y priorización basada en resultados.</p>'], ['Investigación de clientes', '<p>Entrevistas, pruebas de usabilidad, mapas de experiencia y síntesis de comentarios.</p>'], ['Analítica de producto', '<p>SQL, análisis de embudos, experimentación y paneles de datos.</p>'], ['Colaboración', '<ul><li>Facilitación de talleres</li><li>Planificación de lanzamientos</li><li>Comunicación con partes interesadas</li></ul>']] },
    projects: { title: 'Proyectos seleccionados', items: [['Rediseño de incorporación al espacio de trabajo', 'Ciudad Ejemplo', '<p>Rediseño de la primera experiencia de uso de un producto ficticio de colaboración.</p><ul><li>Detección de barreras mediante entrevistas y pruebas de usabilidad.</li><li>Lista guiada con indicadores de progreso claros.</li><li>Hitos de activación y proceso repetible de revisión de experimentos.</li></ul>'], ['Centro de comentarios de clientes', 'Ciudad Ejemplo', '<p>Espacio compartido para organizar comentarios sobre el producto.</p><ul><li>Integración de comentarios de soporte e investigación.</li><li>Etiquetado coherente de necesidades recurrentes.</li><li>Conexión de revisiones de oportunidades con la planificación trimestral.</li></ul>'], ['Portal de gestión de suscripciones', 'Ciudad Ejemplo', '<ul><li>Flujos de autoservicio para cambios de plan y preferencias de facturación.</li><li>Mensajes claros sobre el estado de la cuenta junto al equipo de soporte.</li><li>Revisión de accesibilidad y recuperación ante errores.</li></ul>'], ['Panel de salud del producto', 'Pueblo Muestra', '<ul><li>Métricas compartidas de adopción y retención.</li><li>Vistas de informes para revisiones semanales.</li><li>Definiciones de eventos documentadas para mejorar la coherencia.</li></ul>'], ['Arquitectura de información del centro de ayuda', 'Pueblo Muestra', '<ul><li>Documentación reorganizada según tareas frecuentes de clientes.</li><li>Etiquetas de navegación probadas con usuarios representativos.</li><li>Proceso editorial para artículos de uso frecuente.</li></ul>'], ['Piloto de repositorio de investigación', 'Pueblo Muestra', '<ul><li>Notas y hallazgos organizados en una biblioteca consultable.</li><li>Plantillas para registrar evidencias y preguntas abiertas.</li><li>Sesiones de intercambio para equipos de producto y diseño.</li></ul>']] }
  },
  fr: {
    position: 'Responsable produit senior',
    profile: '<p>Expérience en gestion de produit, de la recherche utilisateur à la création de produits numériques concrets. Spécialisé dans les feuilles de route, la collaboration transverse et la mesure des résultats, avec une approche fondée sur les données.</p>',
    work: [
      { title: 'Responsable produit senior', employer: 'Studio produit Étoile du Nord', city: 'Ville Exemple', description: '<p>Responsable de la feuille de route d’une suite fictive de collaboration destinée aux petites entreprises.</p><ul><li><strong>Découverte produit :</strong> entretiens réguliers et tests d’utilisabilité pour repérer les besoins.</li><li><strong>Planification :</strong> priorisation selon l’impact client, l’effort de livraison et les objectifs métier.</li><li><strong>Collaboration :</strong> améliorations continues avec le design, l’ingénierie et le support.</li><li><strong>Mesure :</strong> définition des indicateurs d’adoption et de fidélisation, puis revues après lancement.</li></ul>' },
      { title: 'Analyste produit', employer: 'Atelier numérique Horizon', city: 'Ville Modèle', description: '<p>Contribution à la recherche et au reporting pour un service d’abonnement fictif. Création de tableaux de bord, analyse des retours clients et amélioration de l’accueil et de la gestion des comptes.</p>' }
    ],
    education: { school: 'Institut de design Exemple', degree: 'Licence en design d’interaction', city: 'Ville Modèle' },
    languages: [['Français', 'Langue maternelle'], ['Anglais', 'Intermédiaire avancé']],
    skills: { title: 'Compétences', items: [['Stratégie produit', '<p>Feuilles de route, évaluation des opportunités, positionnement et priorisation par les résultats.</p>'], ['Recherche utilisateur', '<p>Entretiens, tests d’utilisabilité, parcours utilisateurs et synthèse des retours.</p>'], ['Analyse produit', '<p>SQL, analyse de parcours, expérimentation et tableaux de bord.</p>'], ['Collaboration', '<ul><li>Animation d’ateliers</li><li>Planification des lancements</li><li>Communication avec les parties prenantes</li></ul>']] },
    projects: { title: 'Projets sélectionnés', items: [['Refonte de l’accueil de l’espace de travail', 'Ville Exemple', '<p>Refonte de la première expérience d’un produit collaboratif fictif.</p><ul><li>Identification des obstacles grâce aux entretiens et tests utilisateurs.</li><li>Création d’une checklist guidée avec une progression visible.</li><li>Définition des jalons d’activation et d’un processus de revue des tests.</li></ul>'], ['Centre de retours clients', 'Ville Exemple', '<p>Création d’un espace partagé pour organiser les retours produit.</p><ul><li>Centralisation des retours du support et des sessions de recherche.</li><li>Modèle de tags cohérent pour les besoins récurrents.</li><li>Lien entre les revues d’opportunités et la planification trimestrielle.</li></ul>'], ['Portail de gestion des abonnements', 'Ville Exemple', '<ul><li>Parcours en libre-service pour les changements d’offre et de facturation.</li><li>Clarification des messages d’état des comptes avec le support.</li><li>Vérification de l’accessibilité et de la récupération après erreur.</li></ul>'], ['Tableau de santé produit', 'Ville Modèle', '<ul><li>Définition d’indicateurs communs d’adoption et de fidélisation.</li><li>Vues de reporting pour les revues produit hebdomadaires.</li><li>Documentation des événements pour renforcer la cohérence.</li></ul>'], ['Architecture de l’aide en ligne', 'Ville Modèle', '<ul><li>Documentation réorganisée autour des tâches fréquentes.</li><li>Libellés de navigation testés auprès d’utilisateurs représentatifs.</li><li>Processus de révision éditoriale pour les articles clés.</li></ul>'], ['Pilote du référentiel de recherche', 'Ville Modèle', '<ul><li>Notes d’entretien et résultats classés dans une bibliothèque consultable.</li><li>Modèles pour consigner les preuves et les questions ouvertes.</li><li>Partage de connaissances avec les équipes produit et design.</li></ul>']] }
  }
};

export function getSampleResume(locale) {
  const resume = structuredClone(sample);
  const content = localizedSamples[locale];
  if (!content) return resume;

  resume.locale = locale;
  resume.position = content.position;
  resume.profile = content.profile;
  resume.workExperiences = resume.workExperiences.map((item, index) => ({ ...item, ...content.work[index] }));
  Object.assign(resume.educations[0], content.education);
  resume.languages.forEach((item, index) => Object.assign(item, { language: content.languages[index][0], level: content.languages[index][1] }));
  const skills = resume.customSections.find((section) => section.externalId === 'sample-skills');
  skills.title = content.skills.title;
  skills.items.forEach((item, index) => Object.assign(item, { title: content.skills.items[index][0], description: content.skills.items[index][1] }));
  const projects = resume.customSections.find((section) => section.externalId === 'sample-projects');
  projects.title = content.projects.title;
  projects.items.forEach((item, index) => Object.assign(item, { title: content.projects.items[index][0], city: content.projects.items[index][1], description: content.projects.items[index][2] }));
  return resume;
}