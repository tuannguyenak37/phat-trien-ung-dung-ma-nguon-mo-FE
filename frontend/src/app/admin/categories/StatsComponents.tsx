"use client";
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { format } from "date-fns";

// --- BIỂU ĐỒ TRÒN (DISTRIBUTION) ---
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export const DistributionChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <div className="text-center text-gray-400 py-10">Chưa có dữ liệu</div>;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="count"
            nameKey="name"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
             formatter={(value: number) => [`${value} bài`, 'Số lượng']}
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- BIỂU ĐỒ ĐƯỜNG (GROWTH) ---
export const GrowthChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return <div className="text-center text-gray-400 py-10">Chưa có dữ liệu tăng trưởng</div>;

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" vertical={false} />
          <XAxis 
            dataKey="time_point" 
            tickFormatter={(str) => format(new Date(str), "dd/MM")}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} allowDecimals={false} />
          <RechartsTooltip
            labelFormatter={(label) => format(new Date(label), "dd/MM/yyyy")}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Bài viết mới" 
            stroke="#3B82F6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "#3B82F6" }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};