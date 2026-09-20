import React, { useMemo } from 'react';
import {
  User, GraduationCap, HeartHandshake, Briefcase, Crown, ShieldCheck
} from 'lucide-react';

function calculateAge(dobString) {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function FamilyGraph({ members = [], selectedMemberId = null, onSelectMember = () => {} }) {
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

  const getAccentColor = (relation) => {
    const rel = (relation || '').toLowerCase();
    if (rel === 'head') return { border: 'border-amber-300', top: 'bg-amber-500', avatar: 'bg-navy text-amber-300', badge: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (rel === 'spouse') return { border: 'border-purple-200', top: 'bg-purple-500', avatar: 'bg-purple-700 text-white', badge: 'bg-purple-100 text-purple-900 border-purple-300' };
    if (['son', 'daughter'].includes(rel)) return { border: 'border-emerald-200', top: 'bg-emerald-500', avatar: 'bg-emerald-700 text-white', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    return { border: 'border-blue-200', top: 'bg-blue-500', avatar: 'bg-blue-700 text-white', badge: 'bg-blue-100 text-blue-900 border-blue-300' };
  };

  const renderMemberNode = (member) => {
    if (!member) return null;
    const isSelected = selectedMemberId === member.member_id;
    const age = calculateAge(member.dob);
    const colors = getAccentColor(member.relation_to_head);
    const isHead = (member.relation_to_head || '').toLowerCase() === 'head';

    return (
      <button
        key={member.member_id}
        onClick={() => onSelectMember(member)}
        className={`text-left p-3 rounded-xl transition-all bg-white border-2 overflow-hidden group shadow-sm ${colors.border} ${
          isSelected
            ? 'ring-2 ring-orange-500 border-orange-500 shadow-md'
            : 'hover:shadow-md hover:-translate-y-0.5'
        }`}
        style={{ width: '210px' }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.top}`}></div>

        <div className="flex items-center gap-2 mb-2 pt-0.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${colors.avatar}`}>
            {isHead ? <Crown className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
            <p className="text-[11px] text-slate-500">
              {age ? `${age} yrs` : 'Age N/A'} · {member.gender || 'N/A'}
            </p>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase shrink-0 font-bold ${colors.badge}`}>
            {member.relation_to_head}
          </span>
        </div>

        {/* Badges — only contextual ones */}
        <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 text-[10px]">
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
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200 truncate max-w-[130px]" title={member.occupation}>
              <Briefcase className="w-3 h-3 shrink-0 text-slate-500" /> {member.occupation}
            </span>
          )}

          {!member.student_status && !member.disability_status && !member.occupation && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified
            </span>
          )}
        </div>

        {isSelected && (
          <div className="mt-2 pt-1.5 border-t border-orange-200 text-[10px] text-orange-800 font-bold">
            Selected for inspection
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="card-dpi p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
        <h4 className="text-sm font-bold text-slate-800">
          Family Members
        </h4>
        <span className="text-xs bg-navy text-white px-2.5 py-1 rounded-full font-bold">
          {members.length} Members
        </span>
      </div>

      <div className="overflow-x-auto py-2">
        <div className="min-w-[500px] flex flex-col items-center">
          {/* Head & Spouse */}
          <div className="flex items-center justify-center gap-6 relative">
            {renderMemberNode(head)}
            {spouse && (
              <>
                <div className="h-0.5 w-8 bg-gradient-to-r from-amber-400 to-purple-400 relative flex items-center justify-center">
                  <span className="bg-white border border-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    ⚭
                  </span>
                </div>
                {renderMemberNode(spouse)}
              </>
            )}
          </div>

          {/* Connector */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-0.5 h-5 bg-slate-300 my-1"></div>
          )}

          {/* Children & Others */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-full flex flex-col items-center">
              <div
                className="h-0.5 bg-slate-300"
                style={{
                  width: `${Math.max(100, Math.min(children.length + others.length, 4) * 220 - 30)}px`,
                }}
              ></div>

              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {[...children, ...others].map((child) => (
                  <div key={child.member_id} className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-slate-300 mb-1"></div>
                    {renderMemberNode(child)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-3">
        Click any member to view their details and entitlements
      </p>
    </div>
  );
}
