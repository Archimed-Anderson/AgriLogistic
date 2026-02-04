import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface ServiceNode {
  id: string;
  load: number;
  status: 'ok' | 'warn' | 'critical';
}

interface ServiceLink {
  source: string;
  target: string;
}

const data: { nodes: ServiceNode[]; links: ServiceLink[] } = {
  nodes: [
    { id: 'Kong', load: 45, status: 'ok' },
    { id: 'Auth', load: 20, status: 'ok' },
    { id: 'Product', load: 30, status: 'ok' },
    { id: 'Order', load: 55, status: 'ok' },
    { id: 'Logistic', load: 60, status: 'ok' },
    { id: 'Payment', load: 85, status: 'warn' },
    { id: 'Notify', load: 15, status: 'ok' },
    { id: 'AI', load: 90, status: 'ok' },
    { id: 'Blockchain', load: 10, status: 'ok' },
  ],
  links: [
    { source: 'Kong', target: 'Auth' },
    { source: 'Kong', target: 'Product' },
    { source: 'Kong', target: 'Order' },
    { source: 'Kong', target: 'Logistic' },
    { source: 'Kong', target: 'Payment' },
    { source: 'Order', target: 'Product' },
    { source: 'Order', target: 'Logistic' },
    { source: 'Order', target: 'Payment' },
    { source: 'Logistic', target: 'Blockchain' },
    { source: 'AI', target: 'Order' },
    { source: 'Notify', target: 'Order' },
  ],
};

import { useTheme } from '@/shared/providers/ThemeProvider';

export function ServiceHealthMesh() {
  const { theme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const getColor = (status: string) => {
    switch (status) {
      case 'ok':
        return '#10b981';
      case 'warn':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-[32px] overflow-hidden border border-border bg-card/40 backdrop-blur-xl shadow-2xl transition-all duration-500"
    >
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_var(--success-glow)]" />
          <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-black">
            System Topology
          </p>
        </div>
        <p className="text-sm font-black text-foreground tracking-tighter uppercase whitespace-nowrap">
          Service Mesh Interaction Mesh
        </p>
      </div>

      <div className="w-full h-full opacity-80 dark:opacity-100">
        {dimensions.width > 0 && (
          <ForceGraph2D
            graphData={data}
            backgroundColor="rgba(0,0,0,0)"
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel="id"
            nodeColor={(node) => getColor((node as ServiceNode).status)}
            nodeRelSize={5}
            nodeVal={(node) => (node as ServiceNode).load / 15 + 3}
            linkColor={() => (theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,102,255,0.1)')}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.004}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as any).id;
              const fontSize = 11 / globalScale;
              ctx.font = `bold ${fontSize}px JetBrains Mono, Inter, sans-serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.4);

              // Background for label
              ctx.fillStyle =
                theme === 'dark' ? 'rgba(10, 10, 10, 0.85)' : 'rgba(255, 255, 255, 0.85)';
              ctx.roundRect(
                (node.x as number) - bckgDimensions[0] / 2,
                (node.y as number) - bckgDimensions[1] / 2 + 10,
                bckgDimensions[0],
                bckgDimensions[1],
                4
              );
              ctx.fill();

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = theme === 'dark' ? '#f8fafc' : '#0f172a';
              ctx.fillText(
                label,
                node.x as number,
                (node.y as number) + 10 + bckgDimensions[1] / 2 - fontSize / 2
              );

              // Draw node circle with shadow/glow
              ctx.shadowColor = getColor((node as ServiceNode).status);
              ctx.shadowBlur = theme === 'dark' ? 10 : 4;
              ctx.beginPath();
              ctx.arc(node.x as number, node.y as number, (node as any).val, 0, 2 * Math.PI, false);
              ctx.fillStyle = getColor((node as ServiceNode).status);
              ctx.fill();
              ctx.shadowBlur = 0; // Reset
            }}
          />
        )}
      </div>

      <div className="absolute bottom-6 right-6 z-10 px-3 py-1 bg-card/60 backdrop-blur-md rounded-lg border border-border text-[8px] font-black text-muted-foreground uppercase tracking-widest">
        Active Nodes: {data.nodes.length}
      </div>
    </div>
  );
}
