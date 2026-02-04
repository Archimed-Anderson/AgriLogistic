import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartData {
  month: string;
  [key: string]: string | number | undefined;
}

interface AreaChartComponentProps {
  data: AreaChartData[];
  dataKeys: { key: string; color: string; label: string }[];
  title?: string;
  yAxisLabel?: string;
}

export function AreaChartComponent({ data, dataKeys, title, yAxisLabel }: AreaChartComponentProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {dataKeys.map((item, index) => (
              <linearGradient key={index} id={`color${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#64748b', fontSize: 12 },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          {dataKeys.map((item, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              fillOpacity={1}
              fill={`url(#color${item.key})`}
              strokeWidth={2}
              animationDuration={800}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
