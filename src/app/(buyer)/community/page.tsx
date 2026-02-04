/**
 * Buyer Community Page
 * Discussions, events, and supplier network
 */
'use client';

import React, { useState } from 'react';
import { useCommunity } from '@/hooks/buyer/useCommunity';
import {
  Users,
  MessageSquare,
  Calendar,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Tag,
  Video,
  MapPin,
  GraduationCap,
  Clock,
  UserPlus,
  CheckCircle,
} from 'lucide-react';

const categoryConfig = {
  general: { label: 'Général', color: 'bg-slate-100 text-slate-700' },
  quality: { label: 'Qualité', color: 'bg-emerald-100 text-emerald-700' },
  logistics: { label: 'Logistique', color: 'bg-blue-100 text-blue-700' },
  prices: { label: 'Prix', color: 'bg-amber-100 text-amber-700' },
  tips: { label: 'Astuces', color: 'bg-purple-100 text-purple-700' },
};

const eventTypeConfig = {
  webinar: { icon: Video, color: 'bg-blue-500', label: 'Webinar' },
  meetup: { icon: Users, color: 'bg-emerald-500', label: 'Rencontre' },
  training: { icon: GraduationCap, color: 'bg-purple-500', label: 'Formation' },
};

export default function BuyerCommunityPage() {
  const { discussions, events, membersCount, suppliersInNetwork, isLoading } = useCommunity();
  const [activeTab, setActiveTab] = useState<'discussions' | 'events'>('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatEventDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communauté</h1>
          <p className="text-slate-600">Échangez avec d'autres acheteurs et producteurs</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle discussion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">Membres actifs</span>
          </div>
          <p className="text-3xl font-bold">{membersCount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-slate-500">Discussions</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{discussions.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-emerald-500" />
            <span className="text-sm text-slate-500">Événements à venir</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{events.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'discussions'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Discussions
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'events'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Événements
        </button>
      </div>

      {/* Discussions */}
      {activeTab === 'discussions' && (
        <>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200'
                }`}
              >
                Tous
              </button>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === key ? 'bg-slate-900 text-white' : config.color
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => {
              const catConfig = categoryConfig[discussion.category];

              return (
                <div
                  key={discussion.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${catConfig.color}`}
                        >
                          {catConfig.label}
                        </span>
                        <span className="text-sm text-slate-500">
                          {formatDate(discussion.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {discussion.title}
                      </h3>
                      <p className="text-slate-600 mb-4">{discussion.content}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium text-sm">
                            {discussion.author.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {discussion.author.name}
                            </p>
                            <p className="text-xs text-slate-500">{discussion.author.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                          discussion.isLiked
                            ? 'bg-red-100 text-red-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${discussion.isLiked ? 'fill-current' : ''}`} />
                        {discussion.likesCount}
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-slate-100 text-slate-600">
                        <MessageCircle className="w-4 h-4" />
                        {discussion.repliesCount}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const eventConfig = eventTypeConfig[event.type];
            const EventIcon = eventConfig.icon;
            const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendeesCount : null;

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className={`${eventConfig.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <EventIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">{eventConfig.label}</span>
                    </div>
                    {event.isRegistered && (
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg text-white text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Inscrit
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      {event.attendeesCount} participants
                      {spotsLeft && (
                        <span className="text-amber-600">({spotsLeft} places restantes)</span>
                      )}
                    </div>
                  </div>
                  {!event.isRegistered ? (
                    <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      S'inscrire
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium">
                      Voir les détails
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
