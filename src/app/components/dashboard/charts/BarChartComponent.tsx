import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface BarChartComponentProps {
  data: BarChartData[];
  dataKeys: { key: string; color: string; label: string }[];
  title?: string;
  yAxisLabel?: string;
}

export function BarChartComponent({ data, dataKeys, title, yAxisLabel }: BarChartComponentProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#e2e8f0' }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } } : undefined}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="rect"
            formatter={(value) => (
              <span className="text-sm text-slate-600">{value}</span>
            )}
          />
          {dataKeys.map((item, index) => (
            <Bar
              key={index}
              dataKey={item.key}
              fill={item.color}
              radius={[4, 4, 0, 0]}
              animationDuration={800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
