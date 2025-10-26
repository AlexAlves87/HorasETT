import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface MonthlyData {
  month: string;
  neto: number;
  deducciones: number;
}

interface MonthlyHistoryChartProps {
  data: MonthlyData[];
}

export default function MonthlyHistoryChart({ data }: MonthlyHistoryChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
            formatter={(value: number) => `${value.toFixed(2)}€`}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: "20px"
            }}
          />
          <Bar 
            dataKey="deducciones" 
            stackId="a"
            fill="hsl(var(--destructive))" 
            name="Deducciones"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="neto" 
            stackId="a"
            fill="hsl(var(--accent))" 
            name="Neto"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Leyenda informativa */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Cada barra representa el salario bruto total (Neto + Deducciones)
      </div>
    </motion.div>
  );
}