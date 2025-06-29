import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCards({ title, value, icon: Icon, bgColor, trend }) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-white">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${bgColor} bg-opacity-20 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
            <span className="text-slate-300">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}