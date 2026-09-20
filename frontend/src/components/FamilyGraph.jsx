import React, { useMemo } from 'react';
import { User, GraduationCap, HeartHandshake, Briefcase, Award } from 'lucide-react';

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

  const renderMemberNode = (member) => {
    if (!member) return null;
    const isSelected = selectedMemberId === member.member_id;
    const age = calculateAge(member.dob);

    return (
      <button
        key={member.member_id}
        onClick={() => onSelectMember(member)}
        className={`text-left p-3 rounded-lg transition-all duration-150 relative bg-white border ${
          isSelected
            ? 'border-orange ring-1 ring-orange shadow-sm'
            : 'border-slate-border hover:border-navy hover:shadow-card'
        }`}
        style={{ width: '210px' }}
      >
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              member.relation_to_head === 'Head' ? 'bg-navy text-white' : 'bg-slate-100 text-navy'
            }`}>
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-text truncate" title={member.name}>
                {member.name}
              </p>
              <p className="text-[11px] text-slate-secondary">
                {member.relation_to_head} {age ? `· ${age}y` : ''}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            {member.gender ? member.gender[0] : ''}
          </span>
        </div>

        {/* Status indicator badges */}
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-border text-[10px]">
          {member.student_status && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              <GraduationCap className="w-3 h-3" /> Student
            </span>
          )}
          {member.disability_status && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
              <HeartHandshake className="w-3 h-3" /> Disability
            </span>
          )}
          {member.occupation && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-[120px]">
              <Briefcase className="w-3 h-3 shrink-0" /> {member.occupation}
            </span>
          )}
          {member.education_level && member.education_level !== 'None' && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
              <Award className="w-3 h-3" /> {member.education_level}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="card-dpi p-5 bg-[#FAFBFC]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-border pb-2.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-text">Family Relationship Structure</h4>
          <p className="text-xs text-slate-secondary">
            Deterministic kinship mapping derived from Family ID civil registry records
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-border font-medium">
          {members.length} {members.length === 1 ? 'Individual' : 'Individuals'}
        </span>
      </div>

      <div className="overflow-x-auto py-2">
        <div className="min-w-[500px] flex flex-col items-center">
          {/* Generation 1: Head & Spouse */}
          <div className="flex items-center justify-center gap-8 relative">
            {renderMemberNode(head)}
            {spouse && (
              <>
                <div className="h-0.5 w-8 bg-slate-300 relative flex items-center justify-center">
                  <span className="bg-slate-200 text-slate-600 text-[9px] px-1 rounded font-mono">
                    =
                  </span>
                </div>
                {renderMemberNode(spouse)}
              </>
            )}
          </div>

          {/* Vertical connector to Generation 2 */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-0.5 h-6 bg-slate-300 my-0.5"></div>
          )}

          {/* Generation 2: Children & Dependents */}
          {(children.length > 0 || others.length > 0) && (
            <div className="w-full flex flex-col items-center">
              {/* Horizontal crossbar branching to all children */}
              <div
                className="h-0.5 bg-slate-300"
                style={{
                  width: `${Math.max(100, Math.min(children.length + others.length, 4) * 220 - 40)}px`,
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
        Click any member card to inspect linked civil identity records and specific scheme eligibility
      </p>
    </div>
  );
}
