import React, { useMemo } from 'react';
import {
  User, GraduationCap, HeartHandshake, Briefcase, Award, Crown,
  ShieldCheck, Check, Sparkles, AlertCircle
} from 'lucide-react';

function calculateAge(dobString) {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function FamilyGraph({ members = [], selectedMemberId = null, onSelectMember = () => {} }) {
  // Organize members into Head, Spouse, Children, and Others
  const { head, spouse, children, others } = useMemo(() => {
    let head = null;
    let spouse = null;
    const children = [];
    const others = [];

    members.forEach((m) => {
      const rel = (m.relation_to_head || '').toLowerCase();
      if (rel === 'head' && !head) {
        head = m;
      } else if (rel === 'spouse' && !spouse) {
        spouse = m;
      } else if (['son', 'daughter'].includes(rel)) {
        children.push(m);
      } else {
        others.push(m);
      }
    });

    if (!head && members.length > 0) {
      head = members[0];
    }

    return { head, spouse, children, others };
  }, [members]);

  const getMemberStyling = (relation) => {
    const rel = (relation || '').toLowerCase();
    if (rel === 'head') {
      return {
        cardBorder: 'border-amber-400 bg-amber-50/20',
        topBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
        avatarBg: 'bg-gradient-to-br from-navy to-navy-dark text-amber-300 border-2 border-amber-300',
        roleBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        icon: <Crown className="w-3.5 h-3.5 text-amber-400" />
      };
    }
    if (rel === 'spouse') {
      return {
        cardBorder: 'border-purple-300 bg-purple-50/20',
        topBar: 'bg-gradient-to-r from-purple-500 to-pink-500',
        avatarBg: 'bg-gradient-to-br from-purple-700 to-pink-600 text-white border-2 border-purple-200',
        roleBadge: 'bg-purple-100 text-purple-900 border-purple-300 font-semibold',
        icon: <User className="w-3.5 h-3.5" />
      };
    }
    if (['son', 'daughter'].includes(rel)) {
      return {
        cardBorder: 'border-emerald-300 bg-emerald-50/20',
        topBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        avatarBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-2 border-emerald-200',
        roleBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
        icon: <User className="w-3.5 h-3.5" />
      };
    }
    return {
      cardBorder: 'border-blue-300 bg-blue-50/20',
      topBar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      avatarBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-2 border-blue-200',
      roleBadge: 'bg-blue-100 text-blue-900 border-blue-300 font-semibold',
      icon: <User className="w-3.5 h-3.5" />
    };
  };

  const renderMemberNode = (member) => {
    if (!member) return null;
    const isSelected = selectedMemberId === member.member_id;
    const age = calculateAge(member.dob);
    const styling = getMemberStyling(member.relation_to_head);

    return (
      <button
        key={member.member_id}
        onClick={() => onSelectMember(member)}
        className={`text-left p-3.5 rounded-xl transition-all duration-200 relative bg-white border-2 overflow-hidden group shadow-sm ${
          styling.cardBorder
        } ${
          isSelected
            ? 'ring-2 ring-orange-500 border-orange-500 shadow-md scale-[1.02]'
            : 'hover:border-navy hover:shadow-md hover:-translate-y-0.5'
        }`}
        style={{ width: '225px' }}
      >
        {/* Top Colored Accent Stripe */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${styling.topBar}`}></div>

        <div className="flex items-start justify-between gap-2 mb-2 pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${styling.avatarBg}`}>
              {styling.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate" title={member.name}>
                {member.name}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {age ? `${age} yrs` : 'Age N/A'} · {member.gender || 'N/A'}
              </p>
            </div>
          </div>

          <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase shrink-0 ${styling.roleBadge}`}>
            {member.relation_to_head}
          </span>
        </div>

        {/* Official Civil & Entitlement Badges */}
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
          {/* Aadhaar Seeded */}
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Linked
          </span>

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
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200 truncate max-w-[130px]" title={member.occupation}>
              <Briefcase className="w-3 h-3 shrink-0 text-slate-500" /> {member.occupation}
            </span>
          )}
        </div>

        {/* Selected Pulse Indicator */}
        {isSelected && (
          <div className="mt-2 pt-1.5 border-t border-orange-200 flex items-center justify-between text-[10px] text-orange-800 font-bold">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
              Inspecting Member
            </span>
            <span className="underline">Dossier Open</span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="card-dpi p-5 bg-gradient-to-b from-white to-slate-50 border border-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>Family Kinship & Relationship Hierarchy</span>
              <span className="gov-stamp text-[9px]">Civil Registry Graph</span>
            </h4>
            <p className="text-xs text-slate-500">
              Deterministic lineage tree linked to Gujarat Family ID master database
            </p>
          </div>
        </div>

        <span className="text-xs bg-navy text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
          {members.length} Registered Members
        </span>
      </div>

      <div className="overflow-x-auto py-3">
        <div className="min-w-[500px] flex flex-col items-center">
          {/* Generation 1: Head & Spouse */}
          <div className="flex items-center justify-center gap-8 relative">
            {renderMemberNode(head)}
            {spouse && (
              <>
                <div className="h-0.5 w-10 bg-gradient-to-r from-amber-400 to-purple-400 relative flex items-center justify-center shadow-sm">
                  <span className="bg-white border border-slate-300 text-slate-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                    ⚭ Marriage
                  </span>
                </div>
                {renderMemberNode(spouse)}
              </>
            )}
          </div>

          {/* Vertical connector to Generation 2 */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-emerald-400 my-1"></div>
          )}

          {/* Generation 2: Children & Dependents */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-full flex flex-col items-center">
              {/* Horizontal crossbar branching to all children */}
              <div
                className="h-0.5 bg-emerald-400 shadow-sm"
                style={{
                  width: `${Math.max(100, Math.min(children.length + others.length, 4) * 235 - 30)}px`,
                }}
              ></div>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {[...children, ...others].map((child) => (
                  <div key={child.member_id} className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-emerald-400 mb-1"></div>
                    {renderMemberNode(child)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
        💡 Click any member node to dynamically open their civil documentation, Aadhaar status, and individualized scheme entitlements
      </p>
    </div>
  );
}
