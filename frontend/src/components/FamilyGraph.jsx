import React, { useMemo } from 'react';
import {
  User, GraduationCap, HeartHandshake, Briefcase, Crown, ShieldCheck,
  Sparkles, Award, ArrowRight, Play, Heart, ChevronRight
} from 'lucide-react';
import { calculateMemberAge, SCHEMES_20 } from '../utils/schemes20Engine';

export default function FamilyGraph({
  members = [],
  family = {},
  selectedMemberId = null,
  onSelectMember = () => {},
  onLaunchSimulator = null,
  lang = 'en'
}) {
  // Organize into 3 clear generational tiers as required by Gujarat Family ID Copilot architecture:
  // 1. Elder Generation (Grandparents / Seniors age 60+)
  // 2. Household Anchor (Head and Spouse)
  // 3. Next Generation (Children, Youth, Dependents)
  const { elders, anchors, nextGen } = useMemo(() => {
    const elders = [];
    const anchors = [];
    const nextGen = [];

    members.forEach((m) => {
      const rel = (m.relation_to_head || '').toLowerCase();
      const age = m.age ?? calculateMemberAge(m.dob);

      if (['father', 'mother', 'grandfather', 'grandmother'].includes(rel) || (age >= 60 && !['head', 'spouse'].includes(rel))) {
        elders.push(m);
      } else if (['head', 'spouse'].includes(rel)) {
        anchors.push(m);
      } else if (['son', 'daughter', 'grandson', 'granddaughter', 'child'].includes(rel) || age < 25) {
        nextGen.push(m);
      } else {
        if (age >= 60) elders.push(m);
        else if (age >= 25) anchors.push(m);
        else nextGen.push(m);
      }
    });

    // Ensure head is first in anchors
    anchors.sort((a, b) => {
      if ((a.relation_to_head || '').toLowerCase() === 'head') return -1;
      if ((b.relation_to_head || '').toLowerCase() === 'head') return 1;
      return 0;
    });

    return { elders, anchors, nextGen };
  }, [members]);

  const getAccentColor = (relation, isHead) => {
    const rel = (relation || '').toLowerCase();
    if (isHead) return { border: 'border-amber-400', top: 'bg-amber-500', avatar: 'bg-navy text-amber-300', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (rel === 'spouse') return { border: 'border-purple-300', top: 'bg-purple-500', avatar: 'bg-purple-700 text-white', badge: 'bg-purple-100 text-purple-900 border-purple-300' };
    if (['son', 'daughter', 'child'].includes(rel)) return { border: 'border-emerald-300', top: 'bg-emerald-500', avatar: 'bg-emerald-700 text-white', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    return { border: 'border-blue-300', top: 'bg-blue-500', avatar: 'bg-blue-700 text-white', badge: 'bg-blue-100 text-blue-900 border-blue-300' };
  };

  // Find member targeted schemes from the 20-scheme declarative engine
  const getMemberSchemes = (member) => {
    if (!family) return [];
    const targeted = [];
    SCHEMES_20.forEach((s) => {
      if (s.scope === 'member' && s.predicate(family, member, members)) {
        targeted.push(s);
      }
    });
    return targeted;
  };

  const renderMemberCard = (member) => {
    if (!member) return null;
    const isSelected = selectedMemberId === member.member_id;
    const age = member.age ?? calculateMemberAge(member.dob);
    const isHead = (member.relation_to_head || '').toLowerCase() === 'head';
    const colors = getAccentColor(member.relation_to_head, isHead);
    const qualifiedSchemes = getMemberSchemes(member);

    return (
      <div
        key={member.member_id}
        className={`relative text-left p-3.5 rounded-xl transition-all bg-white border-2 overflow-hidden shadow-xs hover:shadow-md ${colors.border} ${
          isSelected ? 'ring-2 ring-navy border-navy shadow-md scale-[1.02]' : ''
        }`}
        style={{ width: '240px' }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.top}`}></div>

        {/* Member Header */}
        <div className="flex items-start gap-2.5 mb-2 pt-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${colors.avatar}`}>
            {isHead ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate" title={member.name}>
              {member.name}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              {age !== null ? `${age} yrs` : 'Age N/A'} · {member.gender || 'N/A'}
            </p>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase shrink-0 font-bold ${colors.badge}`}>
            {member.relation_to_head}
          </span>
        </div>

        {/* Demographic Badges */}
        <div className="flex flex-wrap gap-1 mb-2.5 text-[10px]">
          {member.student_status && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
              <GraduationCap className="w-3 h-3 text-blue-600" /> Student
            </span>
          )}
          {member.disability_status && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-300">
              <HeartHandshake className="w-3 h-3 text-amber-600" /> Divyang
            </span>
          )}
          {member.occupation && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200 truncate max-w-[130px]">
              <Briefcase className="w-3 h-3 shrink-0 text-slate-500" /> {member.occupation}
            </span>
          )}
        </div>

        {/* Targeted Welfare Entitlements (Association) */}
        {qualifiedSchemes.length > 0 && (
          <div className="mb-2.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>Targeted Benefits ({qualifiedSchemes.length}):</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {qualifiedSchemes.map((s) => (
                <span
                  key={s.id}
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 truncate max-w-[210px]"
                  title={`${s.name}: ${s.benefit}`}
                >
                  ✓ {s.name.split('(')[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar: Select or Dispatch Simulator */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => onSelectMember(member)}
            className="text-[10px] font-bold text-navy hover:underline"
          >
            Audit Profile
          </button>

          {onLaunchSimulator && (
            <button
              type="button"
              onClick={() => onLaunchSimulator(member.member_id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold transition-colors"
              title={`Simulate Life Transition for ${member.name}`}
            >
              <Sparkles className="w-3 h-3 text-[#FF671F]" />
              <span>Simulate</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 3 GENERATIONAL TIERS */}

      {/* Tier 1: Elder Generation (Grandparents / Seniors 60+) */}
      {elders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Elder Generation · વરિષ્ઠ પેઢી (Age 60+ · Senior Social Security)
            </h3>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono">
              {elders.length} Elders
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pl-4 border-l-2 border-amber-300">
            {elders.map((m) => renderMemberCard(m))}
          </div>
        </div>
      )}

      {/* Tier 2: Household Anchor (Head & Spouse) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-navy"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-serif">
            Household Anchor · કુટુંબના મુખ્ય સ્તંભ (Head of Household & Spouse)
          </h3>
          <span className="text-[10px] px-2 py-0.2 rounded-full bg-navy/10 text-navy font-mono font-bold">
            {anchors.length} Pillars
          </span>
        </div>
        <div className="flex flex-wrap gap-3 pl-4 border-l-2 border-navy">
          {anchors.map((m) => renderMemberCard(m))}
        </div>
      </div>

      {/* Tier 3: Next Generation (Children, Youth, Dependents) */}
      {nextGen.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Next Generation · નવી પેઢી (Children & Youth · Education & Skilling)
            </h3>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              {nextGen.length} Youth/Children
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pl-4 border-l-2 border-emerald-300">
            {nextGen.map((m) => renderMemberCard(m))}
          </div>
        </div>
      )}
    </div>
  );
}
