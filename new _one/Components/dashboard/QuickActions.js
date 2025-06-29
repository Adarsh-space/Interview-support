import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions({ onRefresh }) {
  const navigate = useNavigate();

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400"
          onClick={() => navigate(createPageUrl("CreateSession"))}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400"
          onClick={() => navigate(createPageUrl("Users"))}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Manage Users
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 text-slate-300 hover:text-purple-400"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-600 hover:border-orange-500 hover:bg-orange-500/10 text-slate-300 hover:text-orange-400"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  );
}