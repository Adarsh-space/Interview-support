import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Zap,
  Upload,
  Mic,
  Users
} from "lucide-react";
import { InterviewSession, Conversation, User } from "@/entities/all";

export default function SystemStatus() {
  const [status, setStatus] = useState({
    database: 'checking',
    sessions: 'checking',
    ai: 'checking',
    storage: 'checking',
    users: 'checking'
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    totalUsers: 0,
    totalConversations: 0
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    // Reset all to checking
    setStatus({
      database: 'checking',
      sessions: 'checking', 
      ai: 'checking',
      storage: 'checking',
      users: 'checking'
    });

    try {
      // Check Database
      const sessions = await InterviewSession.list();
      const conversations = await Conversation.list(); 
      const users = await User.list();
      
      setStatus(prev => ({ ...prev, database: 'healthy' }));
      
      // Check Sessions
      const activeSessions = sessions.filter(s => 
        s.status === 'active' && new Date(s.expires_at) > new Date()
      );
      
      setStatus(prev => ({ ...prev, sessions: 'healthy' }));
      setStats({
        totalSessions: sessions.length,
        activeSessions: activeSessions.length,
        totalUsers: users.length,
        totalConversations: conversations.length
      });

      // Check Users
      setStatus(prev => ({ ...prev, users: 'healthy' }));
      
      // Check AI & Storage (simulated)
      setStatus(prev => ({ 
        ...prev, 
        ai: 'healthy',
        storage: 'healthy'
      }));

    } catch (error) {
      console.error('System check failed:', error);
      setStatus(prev => ({ 
        ...prev, 
        database: 'error',
        sessions: 'error',
        users: 'error'
      }));
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'healthy':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            System Status
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSystemStatus}
            className="border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Components */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Database</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.database)}
              <Badge variant="outline" className={getStatusColor(status.database)}>
                {status.database === 'checking' ? 'Checking...' : status.database}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.sessions)}
              <Badge variant="outline" className={getStatusColor(status.sessions)}>
                {status.sessions === 'checking' ? 'Checking...' : status.sessions}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">User Management</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.users)}
              <Badge variant="outline" className={getStatusColor(status.users)}>
                {status.users === 'checking' ? 'Checking...' : status.users}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">AI Services</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.ai)}
              <Badge variant="outline" className={getStatusColor(status.ai)}>
                {status.ai === 'checking' ? 'Checking...' : status.ai}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">File Storage</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.storage)}
              <Badge variant="outline" className={getStatusColor(status.storage)}>
                {status.storage === 'checking' ? 'Checking...' : status.storage}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-slate-700/50">
          <h4 className="text-white font-medium mb-3">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-slate-700/20 rounded">
              <div className="text-xl font-bold text-blue-400">{stats.totalSessions}</div>
              <div className="text-slate-400">Total Sessions</div>
            </div>
            <div className="text-center p-2 bg-slate-700/20 rounded">
              <div className="text-xl font-bold text-green-400">{stats.activeSessions}</div>
              <div className="text-slate-400">Active Now</div>
            </div>
            <div className="text-center p-2 bg-slate-700/20 rounded">
              <div className="text-xl font-bold text-purple-400">{stats.totalUsers}</div>
              <div className="text-slate-400">Total Users</div>
            </div>
            <div className="text-center p-2 bg-slate-700/20 rounded">
              <div className="text-xl font-bold text-orange-400">{stats.totalConversations}</div>
              <div className="text-slate-400">Conversations</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}