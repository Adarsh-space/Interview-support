import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Shield,
  HardDrive
} from "lucide-react";
import { InterviewSession, Conversation, User } from "@/entities/all";

export default function DatabaseInfo() {
  const [dbStats, setDbStats] = useState({
    sessions: 0,
    conversations: 0,
    users: 0,
    isLoading: true,
    lastUpdated: null
  });

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    setDbStats(prev => ({ ...prev, isLoading: true }));
    
    try {
      const [sessions, conversations, users] = await Promise.all([
        InterviewSession.list(),
        Conversation.list(),
        User.list()
      ]);

      setDbStats({
        sessions: sessions.length,
        conversations: conversations.length,
        users: users.length,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Failed to load database stats:', error);
      setDbStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            Database Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDatabaseStats}
            disabled={dbStats.isLoading}
            className="border-slate-600 hover:border-green-500 hover:bg-green-500/10 text-slate-300 hover:text-green-400"
          >
            <RefreshCw className={`w-4 h-4 ${dbStats.isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-slate-300">Connection Status</span>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            Connected
          </Badge>
        </div>

        {/* Database Type */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">Database Type</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            base44 Managed
          </Badge>
        </div>

        {/* Security */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-slate-300">Security</span>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            Encrypted
          </Badge>
        </div>

        {/* Data Statistics */}
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            Storage Statistics
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-700/20 rounded-lg">
              <div className="text-xl font-bold text-blue-400">
                {dbStats.isLoading ? '...' : dbStats.sessions}
              </div>
              <div className="text-xs text-slate-400">Sessions</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/20 rounded-lg">
              <div className="text-xl font-bold text-green-400">
                {dbStats.isLoading ? '...' : dbStats.conversations}
              </div>
              <div className="text-xs text-slate-400">Conversations</div>
            </div>
            
            <div className="text-center p-3 bg-slate-700/20 rounded-lg">
              <div className="text-xl font-bold text-purple-400">
                {dbStats.isLoading ? '...' : dbStats.users}
              </div>
              <div className="text-xs text-slate-400">Users</div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {dbStats.lastUpdated && (
          <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700/50">
            Last updated: {dbStats.lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Info Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Managed Database</p>
              <p className="text-xs leading-relaxed">
                Your database is fully managed by base44 with automatic backups, 
                scaling, and security. No configuration required.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}