import { useState } from 'react';
import { postMessage } from '../vscode';
import type { CodeRabbitIssue } from '../types';

interface Props {
  issues: CodeRabbitIssue[];
}

function severityBadgeClass(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'cr-badge-critical';
    case 'Major':
      return 'cr-badge-major';
    case 'Medium':
      return 'cr-badge-medium';
    case 'Minor':
      return 'cr-badge-minor';
    default:
      return 'cr-badge-nitpick';
  }
}

function groupBySeverity(issues: CodeRabbitIssue[]): Map<string, CodeRabbitIssue[]> {
  const groups = new Map<string, CodeRabbitIssue[]>();
  for (const issue of issues) {
    const key = `${issue.severityIcon} ${issue.severity}`;
    const list = groups.get(key) ?? [];
    list.push(issue);
    groups.set(key, list);
  }
  return groups;
}

function shortenPath(filePath: string): string {
  const parts = filePath.split('/');
  if (parts.length <= 3) return filePath;
  return '\u2026/' + parts.slice(-2).join('/');
}

export function CodeRabbitSection({ issues }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  if (issues.length === 0) return null;

  const groups = groupBySeverity(issues);

  const toggleGroup = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <div className="section-header">
        <span className="section-title">CodeRabbit Issues ({issues.length})</span>
      </div>
      <div className="cr-issues">
        {[...groups.entries()].map(([groupKey, groupIssues]) => {
          const isCollapsed = collapsed.has(groupKey);
          const severity = groupIssues[0].severity;
          return (
            <div key={groupKey} className="cr-group">
              <button className="cr-group-header" onClick={() => toggleGroup(groupKey)}>
                <span className="cr-group-chevron">{isCollapsed ? '\u25B8' : '\u25BE'}</span>
                <span className={`cr-severity-badge ${severityBadgeClass(severity)}`}>
                  {groupKey}
                </span>
                <span className="cr-group-count">{groupIssues.length}</span>
              </button>
              {!isCollapsed && (
                <div className="cr-group-items">
                  {groupIssues.map((issue, i) => (
                    <IssueCard key={`${issue.filePath}:${issue.line}:${i}`} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function IssueCard({ issue }: { issue: CodeRabbitIssue }) {
  return (
    <button
      className="cr-issue-card"
      onClick={() => postMessage({ type: 'openFile', path: issue.filePath, line: issue.line })}
      title={`${issue.filePath}:${issue.line}`}
    >
      <div className="cr-issue-title">{issue.title || issue.category}</div>
      <div className="cr-issue-location">
        <span className="cr-issue-file">{shortenPath(issue.filePath)}</span>
        <span className="cr-issue-line">:{issue.line}</span>
      </div>
    </button>
  );
}
