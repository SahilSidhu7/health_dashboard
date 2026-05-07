import { useEffect, useState } from 'react';
import './styles.css';
import { HealthScore } from './components/HealthScore';
import { MetricCards } from './components/MetricCards';
import { TrendChart } from './components/TrendChart';
import { WorkloadChart } from './components/WorkloadChart';
import { RuleViolations } from './components/RuleViolations';
import { RetentionStat } from './components/RetentionStat';
import { RefreshButton } from './components/RefreshButton';
import { LoadingState } from './components/LoadingState';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  const [data, setData] = useState<any>({
    health: null,
    modlog: null,
    retention: null,
    workload: null,
    trends: null,
    me: null,
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all([
        fetch('/api/health'),
        fetch('/api/modlog'),
        fetch('/api/retention'),
        fetch('/api/workload'),
        fetch('/api/trends'),
        fetch('/api/me')
      ]);

      for (const res of responses) {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${res.status}`);
        }
      }

      const [health, modlog, retention, workload, trends, me] = await Promise.all(
        responses.map(res => res.json())
      );

      setData({ health, modlog, retention, workload, trends, me });
      setLastFetched(new Date());
      setNow(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getMinutesAgo = () => {
    if (!lastFetched) return 0;
    return Math.floor((now.getTime() - lastFetched.getTime()) / 60000);
  };

  if (loading && !data.health) {
    return <LoadingState />;
  }

  const minsAgo = getMinutesAgo();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Community Health</h1>
          {lastFetched && (
            <span className="last-updated">
              Last updated {minsAgo === 0 ? 'just now' : `${minsAgo} minutes ago`}
            </span>
          )}
        </div>
        <div className="dashboard-actions">
          <RefreshButton isMod={data.me?.isMod} onRefresh={fetchData} />
        </div>
      </div>

      <ErrorBanner message={error} />

      <div className="grid-top">
        <HealthScore data={data.health} />
        <MetricCards modlogData={data.modlog} workloadData={data.workload} />
      </div>

      <div className="grid-bottom" style={{ marginBottom: '24px' }}>
        <TrendChart data={data.trends} />
        <WorkloadChart data={data.workload} />
      </div>

      <div className="grid-bottom">
        <RuleViolations data={data.modlog} />
        <RetentionStat data={data.retention} />
      </div>
    </div>
  );
}
