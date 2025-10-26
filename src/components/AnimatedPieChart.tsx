import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useState } from 'react';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface AnimatedPieChartProps {
  data: ChartDataItem[];
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text 
        x={cx} 
        y={cy - 25} 
        dy={8} 
        textAnchor="middle" 
        className="fill-foreground font-bold text-lg"
      >
        {payload.name}
      </text>
      <text 
        x={cx} 
        y={cy + 5} 
        dy={8} 
        textAnchor="middle" 
        fill={fill} 
        className="text-3xl font-bold"
      >
        {value.toFixed(2)}€
      </text>
      <text 
        x={cx} 
        y={cy + 35} 
        dy={8} 
        textAnchor="middle" 
        className="fill-muted-foreground text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function AnimatedPieChart({ data }: AnimatedPieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{
                  filter: activeIndex === index ? 'brightness(1.2)' : 'brightness(1)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(2)}€`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'hsl(var(--foreground))'
            }}
            itemStyle={{
              color: 'hsl(var(--foreground))'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada animada */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveIndex(index)}
          >
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
              animate={{
                scale: activeIndex === index ? 1.3 : 1,
                boxShadow: activeIndex === index 
                  ? `0 0 20px ${item.color}` 
                  : 'none'
              }}
            />
            <span className={`text-sm font-medium ${
              activeIndex === index ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {item.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}