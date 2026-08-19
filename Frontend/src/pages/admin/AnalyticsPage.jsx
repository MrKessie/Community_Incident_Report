import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import DateRangePicker from '../../components/common/DateRangePicker';
import OverviewCards from '../../components/analytics/OverviewCards';
import IncidentsByCategoryChart from '../../components/analytics/IncidentsByCategoryChart';
import IncidentsByStatusChart from '../../components/analytics/IncidentsByStatusChart';
import IncidentsByMonthChart from '../../components/analytics/IncidentsByMonthChart';
import SeverityDistributionChart from '../../components/analytics/SeverityDistributionChart';
import ResponseTimeChart from '../../components/analytics/ResponseTimeChart';
import TeamPerformanceTable from '../../components/analytics/TeamPerformanceTable';
import { useAnalytics } from '../../hooks/useAnalytics';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AnalyticsPage() {
  const { data, loading } = useAnalytics();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Executive Emergency Response Analytics"
          description="Interactive metrics breakdown, trend lines, category distribution, and response crew performance"
          action={
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
            />
          }
        />

        <OverviewCards stats={data?.overview} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IncidentsByCategoryChart data={data?.byCategory} />
          <IncidentsByStatusChart data={data?.byStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SeverityDistributionChart data={data?.bySeverity} />
          <IncidentsByMonthChart data={data?.byMonth} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponseTimeChart />
          <TeamPerformanceTable teams={data?.teamPerformance} />
        </div>
      </div>
    </AdminLayout>
  );
}
