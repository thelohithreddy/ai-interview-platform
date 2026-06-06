import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { showToast } from '../components/ui/Toast'

export default function RoadmapPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { roadmap, generateRoadmap, interviews } = useAppData()

  function handleGenerate() {
    if (!user?.targetRole) {
      showToast('Set your target role in Settings first', 'error')
      navigate('/settings')
      return
    }
    generateRoadmap({ targetRole: user.targetRole })
    showToast('Roadmap generated')
  }

  return (
    <PageShell title="Learning roadmap" subtitle="Personalized path based on your goals" maxWidth={800}>
      {!roadmap ? (
        <Card>
          <EmptyState
            icon="🗺️"
            title="No roadmap yet"
            desc={
              interviews.length >= 1
                ? 'Generate a personalized learning roadmap based on your target role and interview history.'
                : 'Complete at least one interview, then generate a roadmap tailored to your target role.'
            }
            action={
              interviews.length >= 1 && user?.targetRole
                ? { label: 'Generate roadmap', onClick: handleGenerate }
                : { label: user?.targetRole ? 'Complete an interview first' : 'Set target role', onClick: () => navigate(user?.targetRole ? '/interview' : '/settings') }
            }
          />
        </Card>
      ) : (
        <Card>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
            Created {new Date(roadmap.createdAt).toLocaleDateString()}
            {roadmap.targetRole ? ` · Target: ${roadmap.targetRole}` : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {roadmap.phases?.map(phase => (
              <div key={phase.id} style={{
                padding: '14px 16px', backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)', borderRadius: 8,
              }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 4px' }}>{phase.title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Status: {phase.status}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <Button variant="secondary" onClick={handleGenerate}>Regenerate roadmap</Button>
          </div>
        </Card>
      )}
    </PageShell>
  )
}
