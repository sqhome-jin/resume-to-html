# Assistant CV

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md)

Outil local de mise en page et d’export de CV par SQHOME. Il affiche les fichiers JSON compatibles dans le navigateur, sans serveur. Un exemple fictif et localisé est chargé au démarrage.

## Fonctionnalités

- Mise en page professionnelle sur deux colonnes ou classique sur une colonne ; en-têtes standard et avec portrait centré.
- Interface en six langues : chinois simplifié, anglais, japonais, coréen, espagnol et français.
- Modifiez directement l’exemple ou importez votre propre JSON. Les changements apparaissent immédiatement et restent en mémoire dans la page.
- Export HTML, JSON modifié, PDF sur une page ou PDF paginé via l’impression du navigateur.
- Visibilité des rubriques, thèmes de couleur, photo de profil et zoom de l’aperçu.

### Captures d’écran

**Espace de travail**

![Paramètres et aperçu du CV](docs/images/app-overview.png)

**Éditeur**

![Éditeur de contenu du CV](docs/images/editor.png)

## Lancement local

Node.js 18 ou version ultérieure est requis.

```sh
npm install
npm run dev
```

Ouvrez l’URL locale indiquée par Vite. Lancez `npm test` et `npm run build` pour tester et compiler.

## Modifier l’exemple

L’exemple localisé est chargé à l’ouverture et peut être modifié directement. Cliquez sur **Modifier le contenu**, effectuez vos changements, puis enregistrez-les. **Télécharger JSON** permet d’en conserver une copie. Si vous changez de langue avec l’exemple intégré, l’exemple d’origine dans cette langue est chargé. Après l’import de votre propre JSON, le changement de langue ne remplace pas son contenu.

## Obtenir le JSON depuis Resume.io

Vous pouvez récupérer le JSON de votre CV depuis une session Resume.io authentifiée :

1. Connectez-vous à votre compte [Resume.io](https://resume.io/).
2. Dans la même session du navigateur, ouvrez [`https://resume.io/api/app/resumes`](https://resume.io/api/app/resumes) et repérez l’`id` du CV souhaité.
3. Ouvrez `https://resume.io/api/app/resumes/{id}` en remplaçant `{id}` par cette valeur. La réponse contient le JSON du CV.
4. Enregistrez la réponse sous `resume.json`, puis choisissez **Importer JSON** dans l’application.

Cet endpoint utilise votre session connectée. Ne partagez pas de réponse contenant des informations personnelles ou des métadonnées de compte. Un `renderingToken` seul ne permet plus de reconstruire le CV ; l’endpoint d’images de Resume.io ne fournit que la première page.

Les champs pris en charge incluent `firstName`, `lastName`, `position`, `profile`, `workExperiences`, `educations`, `skills`, `languages`, `customSections` et `sectionsOrder`. Consultez [`examples/resume.sample.json`](examples/resume.sample.json) pour la structure complète.

## PDF

Le PDF sur une page ajuste tout le CV à une feuille A4 ; le texte sera plus petit pour les CV longs. Le PDF paginé utilise l’impression native du navigateur. Le nom du fichier combine le nom, le poste, `Resume` et la date. Le PDF sur une page est généré sous forme d’image et son texte ne peut pas être sélectionné.

Tout le traitement reste local dans le navigateur. Les URL de photo nécessitent une connexion Internet. Vérifiez le JSON avant de le partager ; les exports modifiés conservent les champs inconnus du fichier source.

## Licence

[MIT License](LICENSE). Les dépendances et polices conservent leurs propres licences. Aucun droit d’utilisation de la marque SQHOME n’est accordé.
