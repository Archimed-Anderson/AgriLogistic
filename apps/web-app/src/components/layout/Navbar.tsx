'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import {
  Sprout,
  BarChart3,
  ShieldCheck,
  Leaf,
  Globe,
  Users,
  Menu,
  ChevronRight,
  ShoppingCart,
  Store,
  Wrench,
  ShoppingBag,
  Truck,
} from 'lucide-react';

const products: { title: string; href: string; description: string; icon: any }[] = [
  {
    title: 'Loueur de Matériel',
    href: '/loueur',
    description: 'Location et vente de matériel agricole et de construction.',
    icon: Wrench,
  },
  {
    title: 'AgriLogistic Link',
    // Link to the new Public Command Center
    href: '/products/agrilogistic-link',
    description: 'Plateforme de mise en relation logistique intelligente.',
    icon: Truck,
  },
  {
    title: 'AgroMarket',
    href: '/marketplace',
    description: 'La marketplace vivrière pour acheter et vendre vos produits agricoles.',
    icon: Store,
  },
  {
    title: 'AgriLogistic Core',
    href: '/solutions/core',
    description: 'La plateforme centrale intelligente pour la gestion des données agricoles.',
    icon: Globe,
  },
  {
    title: 'AgriLogistic Farm',
    href: '/products/agrilogistic-farm',
    description: 'Gestion parcellaire, suivi des récoltes et conseils agronomiques par IA.',
    icon: Leaf,
  },
  {
    title: 'AgriLogistic Trace',
    href: '/solutions/traceability',
    description: "Traçabilité blockchain complète pour garantir l'origine et la qualité.",
    icon: ShieldCheck,
  },
  {
    title: 'Affiliation Hub',
    href: '/affiliation',
    description: 'Boutique partenaires : équipements recommandés au meilleur prix.',
    icon: ShoppingBag,
  },
];

const solutions: { title: string; href: string; description: string }[] = [
  {
    title: 'Pour les Coopératives',
    href: '/solutions/cooperatives',
    description: 'Digitalisez vos membres et optimisez la collecte.',
  },
  {
    title: 'Pour les Industriels',
    href: '/solutions/industrials',
    description: 'Sécurisez vos approvisionnements et assurez la conformité.',
  },
  {
    title: 'Pour les Gouvernements',
    href: '/solutions/governments',
    description: 'Pilotez la sécurité alimentaire nationale avec des données réelles.',
  },
  {
    title: 'Pour la Finance',
    href: '/solutions/finance',
    description: "Évaluez les risques et proposez des assurances récolte basées sur l'IA.",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">AgriLogistic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent font-bold text-muted-foreground hover:text-primary transition-colors">
                    Produits
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {products.map((product) => (
                        <ListItem
                          key={product.title}
                          title={product.title}
                          href={product.href}
                          icon={product.icon}
                        >
                          {product.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent font-bold text-muted-foreground hover:text-primary transition-colors">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {solutions.map((solution) => (
                        <ListItem key={solution.title} title={solution.title} href={solution.href}>
                          {solution.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent font-bold text-muted-foreground hover:text-primary transition-colors text-[13px] tracking-wide uppercase'
                      )}
                    >
                      Blog & Insights
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/marketplace/cart"
                className="relative p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-md animate-bounce-slow">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link
                href="/login"
                className="text-[13px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white text-[13px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                Rejoindre
              </Link>
            </div>

            {/* Mobile Burger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-primary hover:bg-primary/5"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l-primary/10">
                <SheetHeader className="p-6 border-b border-primary/5 text-left bg-slate-50/50">
                  <SheetTitle className="flex items-center gap-2">
                    <Sprout className="h-6 w-6 text-primary" />
                    AgriLogistic
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full overflow-y-auto pb-20">
                  <div className="px-2 py-6 space-y-1">
                    <p className="px-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 mb-3 uppercase">
                      Produits
                    </p>
                    {products.map((p) => (
                      <Link
                        key={p.title}
                        href={p.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-[0.98]"
                      >
                        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                          <p.icon className="h-5 w-5" />
                        </div>
                        {p.title}
                        <ChevronRight className="h-4 w-4 ml-auto opacity-20" />
                      </Link>
                    ))}
                  </div>

                  <div className="px-2 py-6 space-y-1 border-t border-primary/5">
                    <p className="px-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 mb-3 uppercase">
                      Solutions
                    </p>
                    {solutions.map((s) => (
                      <Link
                        key={s.title}
                        href={s.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-[0.98]"
                      >
                        {s.title}
                        <ChevronRight className="h-4 w-4 ml-auto opacity-20" />
                      </Link>
                    ))}
                  </div>

                  <div className="px-6 py-8 border-t border-primary/5 mt-auto bg-slate-50/30 space-y-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-14 font-black rounded-2xl border-primary/10 text-primary hover:bg-primary/5"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 font-black rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                        Rejoindre maintenant
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: any }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-primary/5 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 mb-1">
            {Icon && (
              <Icon className="h-4 w-4 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform" />
            )}
            <div className="text-sm font-black leading-none text-primary">{title}</div>
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground font-medium">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
