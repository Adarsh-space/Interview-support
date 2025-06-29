import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    Users,
    Calendar,
    MessageSquare,
    Plus,
    Clock,
    TrendingUp,
    Activity,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, sessions, loadSessions, isLoading } = useAppStore();
    const [stats, setStats] = useState({
        totalSessions: 0,
        activeSessions: 0,
        completedSessions: 0,
        supportRequests: 0
    });

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    useEffect(() => {
        if (sessions.length > 0) {
            setStats({
                totalSessions: sessions.length,
                activeSessions: sessions.filter(s => s.status === 'active').length,
                completedSessions: sessions.filter(s => s.status === 'completed').length,
                supportRequests: 3 // Mock data
            });
        }
    }, [sessions]);

    const quickActions = [
        {
            title: 'Create New Session',
            description: 'Start a new interview session',
            icon: Plus,
            action: () => navigate('/create-session'),
            color: 'bg-blue-500'
        },
        {
            title: 'View Sessions',
            description: 'Manage all interview sessions',
            icon: Calendar,
            action: () => navigate('/sessions'),
            color: 'bg-green-500'
        },
        {
            title: 'Support Requests',
            description: 'Handle support interventions',
            icon: MessageSquare,
            action: () => navigate('/support'),
            color: 'bg-orange-500'
        },
        {
            title: 'User Management',
            description: 'Manage users and permissions',
            icon: Users,
            action: () => navigate('/users'),
            color: 'bg-purple-500'
        }
    ];

    const recentSessions = sessions.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name || 'Admin'}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Here's what's happening with your interview sessions today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Sessions
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalSessions}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Active Sessions
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.activeSessions}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.completedSessions}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Support Requests
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.supportRequests}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                                            <action.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Sessions */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Recent Sessions
                            </h2>
                            <Button
                                onClick={() => navigate('/sessions')}
                                variant="outline"
                                size="sm"
                            >
                                View All
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {recentSessions.length > 0 ? (
                                recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {session.session_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {session.participant_email}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${session.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}>
                                                {session.status}
                                            </span>
                                            <Button
                                                onClick={() => navigate(`/interview/${session.id}`)}
                                                size="sm"
                                            >
                                                Join
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No sessions yet. Create your first session to get started.
                                    </p>
                                    <Button
                                        onClick={() => navigate('/create-session')}
                                        className="mt-4"
                                    >
                                        Create Session
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 