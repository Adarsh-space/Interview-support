import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Copy, 
  ExternalLink, 
  MoreHorizontal,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentSessions({ sessions, isLoading, onCopyLink }) {
  const getStatusColor = (session) => {
    if (session.status === "active" && new Date(session.expires_at) > new Date()) {
      return "bg-green-500/20 text-green-400 border-green-500/50";
    }
    if (session.status === "expired" || new Date(session.expires_at) <= new Date()) {
      return "bg-red-500/20 text-red-400 border-red-500/50";
    }
    if (session.status === "completed") {
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  };

  const getStatusLabel = (session) => {
    if (session.status === "active" && new Date(session.expires_at) > new Date()) {
      return "Active";
    }
    if (session.status === "expired" || new Date(session.expires_at) <= new Date()) {
      return "Expired";
    }
    if (session.status === "completed") {
      return "Completed";
    }
    return "Terminated";
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-400" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg bg-slate-700" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32 bg-slate-700" />
                      <Skeleton className="h-3 w-24 bg-slate-700" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <Mic className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No sessions yet</h3>
            <p className="text-slate-400">Create your first interview session to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{session.session_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <UserIcon className="w-3 h-3" />
                        <span>{session.participant_email}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(session.created_date), "MMM d, HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(session)}>
                      {getStatusLabel(session)}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem 
                          onClick={() => onCopyLink(session.user_link)}
                          className="text-slate-300 hover:text-white"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy User Link
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onCopyLink(session.support_link)}
                          className="text-slate-300 hover:text-white"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Support Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 hover:text-white">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}