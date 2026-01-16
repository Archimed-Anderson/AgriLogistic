# 🔧 GUIDE DE DÉBOGAGE - PROBLÈMES D'INTERACTIVITÉ

## 🎯 **DIAGNOSTIC RAPIDE**

### **Symptôme : Page ne s'affiche pas**

#### **Étape 1 : Vérifier la Console**
```
1. Ouvrir la console navigateur (F12)
2. Chercher les erreurs en rouge
3. Noter le message d'erreur exact
```

#### **Erreurs Courantes :**

**Erreur : "Cannot read property 'map' of undefined"**
```
Cause : Données non chargées ou undefined
Solution : Vérifier les données mockées dans mockData.ts

// Exemple de fix
const data = items || []; // Fallback vers tableau vide
```

**Erreur : "Module not found"**
```
Cause : Import incorrect
Solution : Vérifier le chemin d'import

// Mauvais
import { Component } from "./Component";

// Bon
import { Component } from "@/app/components/Component";
```

**Erreur : "React Hook called conditionally"**
```
Cause : Hook useState/useEffect dans condition
Solution : Déplacer le hook au niveau supérieur

// Mauvais
if (condition) {
  const [state, setState] = useState();
}

// Bon
const [state, setState] = useState();
if (condition) {
  // Utiliser state ici
}
```

---

### **Symptôme : Bouton ne répond pas aux clics**

#### **Vérification 1 : Event Handler**
```typescript
// Vérifier que onClick est bien défini
<button onClick={handleClick}>  ✅ Bon
<button>  ❌ Mauvais - pas d'event handler
```

#### **Vérification 2 : État Disabled**
```typescript
// Vérifier qu'il n'est pas disabled
<button disabled={true}>  ❌ Ne répondra pas
<button disabled={false}>  ✅ Répondra
<button>  ✅ Répondra
```

#### **Vérification 3 : Z-Index et Overlay**
```css
/* Vérifier qu'aucun élément ne bloque */
.overlay {
  z-index: 9999; /* Trop élevé, bloque les clics */
}

/* Solution */
.overlay {
  z-index: 10; /* Plus raisonnable */
  pointer-events: none; /* Ne bloque pas les clics */
}
```

#### **Vérification 4 : Fonction Définie**
```typescript
// Vérifier que la fonction existe
const handleClick = () => {
  console.log("Clicked!");
};

<button onClick={handleClick}>  ✅ Fonction définie

<button onClick={nonExistentFunction}>  ❌ Erreur
```

---

### **Symptôme : Navigation ne fonctionne pas**

#### **Diagnostic Étape par Étape :**

**1. Vérifier que onNavigate est passé**
```typescript
// Dans le composant parent (App.tsx)
<ComponentName onNavigate={handleNavigate} />  ✅

// Dans le composant enfant
interface Props {
  onNavigate: (route: string) => void;  ✅ Défini dans les props
}
```

**2. Vérifier que la route existe**
```typescript
// Dans App.tsx - renderContent()
case "/admin/ma-page":
  return <MaPage />;  ✅ Route définie

// Si la route n'existe pas, elle tombera dans default
default:
  return <AdminDashboard />;  ⚠️ Fallback
```

**3. Vérifier le handleNavigate**
```typescript
const handleNavigate = (route: string) => {
  console.log("Navigation vers:", route);  // Debug
  setCurrentRoute(route);
  window.scrollTo(0, 0);
};
```

**4. Vérifier la Sidebar**
```typescript
// Dans Sidebar.tsx - menuItems
{ icon: Icon, label: "Ma Page", route: "/admin/ma-page" }  ✅

// Le route doit correspondre EXACTEMENT au case dans App.tsx
```

---

## 🐛 **ERREURS FRÉQUENTES ET SOLUTIONS**

### **Erreur 1 : "Component not found"**
```
Problème : Import manquant dans App.tsx

Solution :
1. Vérifier que le fichier existe dans /src/app/components/
2. Ajouter l'import en haut de App.tsx
3. Redémarrer le serveur de dev

// Ajouter
import { MaPage } from "./components/MaPage";
```

---

### **Erreur 2 : "Props not defined"**
```
Problème : Props manquantes ou mal typées

Solution :
// Vérifier l'interface
interface Props {
  onNavigate?: (route: string) => void;  // Optional avec ?
}

// Ou fournir une valeur par défaut
export function Component({ onNavigate = () => {} }: Props) {
  // Maintenant onNavigate est toujours défini
}
```

---

### **Erreur 3 : "State not updating"**
```
Problème : setState ne met pas à jour l'UI

Solution 1 : Vérifier la mutation d'objet
// Mauvais - mutation directe
const handleUpdate = () => {
  data.push(newItem);  ❌
  setData(data);  // Ne déclenchera pas re-render
};

// Bon - nouvelle référence
const handleUpdate = () => {
  setData([...data, newItem]);  ✅
};

Solution 2 : Vérifier la dépendance useEffect
useEffect(() => {
  // Code
}, [dependency]);  // Vérifier que dependency est correcte
```

---

### **Erreur 4 : "Page blanche"**
```
Problème : Erreur qui casse tout le rendu

Solution :
1. Ouvrir la console (F12)
2. Identifier l'erreur exacte
3. Ajouter un error boundary

// Error Boundary simple
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error("Erreur:", error, info);
  }
  
  render() {
    return this.props.children;
  }
}

// Utilisation
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🔍 **OUTILS DE DÉBOGAGE**

### **1. Console.log Stratégique**
```typescript
// Au début de la fonction
console.log("🔵 handleClick appelée");

// Avec les données
console.log("📊 Data:", data);

// Avant le setState
console.log("🔄 Avant setState:", currentState);
setState(newState);
console.log("✅ Après setState:", newState);
```

### **2. React DevTools**
```
1. Installer React DevTools (extension navigateur)
2. Ouvrir l'onglet "Components"
3. Inspecter les props et state
4. Vérifier les re-renders
```

### **3. Network Tab**
```
1. Ouvrir l'onglet "Network" (F12)
2. Vérifier les requêtes API
3. Vérifier les status codes
4. Vérifier les réponses
```

### **4. Breakpoints**
```typescript
// Dans le code
debugger;  // Le navigateur s'arrêtera ici

// Ou dans la console DevTools
// Sources > Fichier > Clic sur numéro de ligne
```

---

## 🎯 **CHECKLIST DE DÉBOGAGE**

### **Avant de déboguer :**
```
✅ Vérifier la console pour erreurs
✅ Vérifier que le serveur de dev tourne
✅ Vérifier que les fichiers sont sauvegardés
✅ Rafraîchir la page (Ctrl+F5)
✅ Vider le cache si nécessaire
```

### **Pendant le débogage :**
```
✅ Isoler le problème (quelle page, quel bouton)
✅ Reproduire le problème de manière consistante
✅ Tester avec données différentes
✅ Vérifier les logs console
✅ Utiliser React DevTools
```

### **Après le fix :**
```
✅ Tester que le problème est résolu
✅ Tester les cas edge
✅ Vérifier qu'aucune régression
✅ Documenter le fix
✅ Commit et push
```

---

## 🚨 **PROBLÈMES CRITIQUES**

### **Application ne démarre pas**
```
Problème : Erreur au lancement

Solutions :
1. Vérifier les dépendances
   npm install

2. Vérifier la version de Node
   node --version  (doit être >= 16)

3. Supprimer node_modules et réinstaller
   rm -rf node_modules
   npm install

4. Vérifier package.json
   Toutes les dépendances doivent être installées
```

---

### **Page reste blanche après navigation**
```
Problème : Navigation casse le rendu

Solutions :
1. Vérifier que le composant existe
2. Vérifier les imports
3. Vérifier les props requises
4. Ajouter un fallback

// Exemple de fallback
const renderContent = () => {
  try {
    switch (currentRoute) {
      case "/admin/page":
        return <Page />;
      default:
        return <DefaultPage />;
    }
  } catch (error) {
    console.error("Erreur de rendu:", error);
    return <ErrorPage />;
  }
};
```

---

### **Infinite Loop / Re-renders**
```
Problème : La page freeze, CPU à 100%

Solutions :
1. Vérifier les useEffect sans dépendances
   useEffect(() => {
     setState(value);  // ❌ Peut causer boucle infinie
   });  // Pas de tableau de dépendances

   useEffect(() => {
     setState(value);  // ✅ Ne s'exécute qu'au mount
   }, []);  // Tableau vide

2. Vérifier les setStates dans le render
   // ❌ Mauvais
   function Component() {
     setState(value);  // Re-render infini
     return <div>...</div>;
   }

   // ✅ Bon
   function Component() {
     useEffect(() => {
       setState(value);
     }, []);
     return <div>...</div>;
   }
```

---

## 📋 **TEMPLATE DE RAPPORT DE BUG**

```markdown
## 🐛 Bug Report

**Titre :** [Description courte]

**Sévérité :** [Critique / Majeur / Mineur]

**Page affectée :** [Nom de la page et route]

**Étapes de reproduction :**
1. Aller sur la page X
2. Cliquer sur le bouton Y
3. Observer le problème Z

**Résultat attendu :**
[Ce qui devrait se passer]

**Résultat actuel :**
[Ce qui se passe réellement]

**Erreur console :**
```
[Copier l'erreur de la console]
```

**Capture d'écran :**
[Si applicable]

**Environnement :**
- Navigateur : [Chrome / Firefox / Safari]
- Version : [Version du navigateur]
- OS : [Windows / Mac / Linux]
- Date : [Date du bug]

**Notes additionnelles :**
[Informations supplémentaires]
```

---

## 🔧 **FIXES RAPIDES**

### **Fix 1 : Bouton ne clique pas**
```typescript
// Avant
<div onClick={handleClick}>Click me</div>

// Après (plus robuste)
<button 
  onClick={handleClick}
  className="cursor-pointer"
  type="button"
>
  Click me
</button>
```

---

### **Fix 2 : Navigation ne marche pas**
```typescript
// Vérifier que onNavigate est appelé
<button onClick={() => {
  console.log("Clic détecté");
  onNavigate?.("/admin/page");
  console.log("Navigation appelée");
}}>
  Navigate
</button>
```

---

### **Fix 3 : Données non affichées**
```typescript
// Ajouter fallback et logs
const data = items || [];
console.log("Data à afficher:", data);

return (
  <div>
    {data.length === 0 ? (
      <p>Aucune donnée disponible</p>
    ) : (
      data.map(item => <Item key={item.id} {...item} />)
    )}
  </div>
);
```

---

### **Fix 4 : State pas à jour**
```typescript
// Utiliser callback form si basé sur état précédent
// Avant
setCount(count + 1);  // ⚠️ Peut être stale

// Après
setCount(prevCount => prevCount + 1);  // ✅ Toujours à jour
```

---

## ✅ **VALIDATION POST-FIX**

### **Après chaque correction :**
```
✅ Le bug est résolu
✅ Aucune régression introduite
✅ Tests passent
✅ Code committed
✅ Documentation mise à jour
```

---

## 📞 **SUPPORT**

### **Si le problème persiste :**
```
1. Documenter le bug avec template ci-dessus
2. Vérifier les logs console
3. Vérifier React DevTools
4. Vérifier Network tab
5. Isoler le problème (quel composant exact)
6. Tester avec données différentes
7. Demander de l'aide avec rapport complet
```

---

## 🎓 **RESSOURCES**

### **Documentation**
- React : https://react.dev
- TypeScript : https://www.typescriptlang.org/docs
- Tailwind : https://tailwindcss.com/docs

### **Outils**
- React DevTools : Extension navigateur
- Redux DevTools : Si état global
- Lighthouse : Performance audit

### **Communauté**
- Stack Overflow : Questions/réponses
- GitHub Issues : Bugs spécifiques aux libs
- Discord/Slack : Support temps réel

---

**Dernière mise à jour :** 14 Janvier 2026  
**Version :** AgroDeep v2.1
