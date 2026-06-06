import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { useAuth } from '../context/AuthContext'
import { analyzeResume } from '../services/ai'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { showToast } from '../components/ui/Toast'

const MAX_BYTES = 5 * 1024 * 1024
const INPUT_ID = 'resume-file-input'

const MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
])

function getExtension(name = '') {
  const parts = name.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function isAcceptedFile(file) {
  const ext = getExtension(file.name)
  if (['pdf', 'doc', 'docx'].includes(ext)) return true
  if (file.type && MIME_TYPES.has(file.type)) return true
  return false
}

function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResumePage() {
  const { resumeAnalysis, updateResumeAnalysis, addActivity } = useAppData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState('')

  function validateFile(file) {
    if (!file) return 'No file selected'
    if (!isAcceptedFile(file)) {
      return 'Please upload a PDF, DOC, or DOCX file'
    }
    if (file.size > MAX_BYTES) return 'File must be under 5 MB'
    if (file.size === 0) return 'File is empty'
    return null
  }

  function handleFile(file) {
    setFileError('')
    const err = validateFile(file)
    if (err) {
      setFileError(err)
      showToast(err, 'error')
      return
    }

    updateResumeAnalysis({
      uploaded: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || getExtension(file.name),
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      score: null,
      strengths: [],
      weaknesses: [],
      missingKeywords: [],
      suggestions: [],
      recommendedSkills: [],
      roleMatch: null,
    })

    addActivity({
      type: 'resume',
      label: `Uploaded resume: ${file.name}`,
      count: 1,
    })

    showToast('Resume uploaded successfully')
  }

  function onInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function runAnalysis() {
    if (!resumeAnalysis.uploaded) return
    setAnalyzing(true)
    try {
      const result = await analyzeResume({
        fileName: resumeAnalysis.fileName,
        fileSize: resumeAnalysis.fileSize,
        targetRole: user?.targetRole,
      })
      if (result.stub) {
        updateResumeAnalysis({ status: 'uploaded', score: null })
        showToast('Resume saved. Analysis available after backend connection.', 'info')
      } else {
        updateResumeAnalysis({
          status: 'analyzed',
          score: result.score ?? null,
          strengths: result.strengths ?? [],
          weaknesses: result.weaknesses ?? [],
          suggestions: result.suggestions ?? [],
        })
        showToast('Analysis complete')
      }
    } catch {
      showToast('Analysis failed. Try again later.', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  function clearResume() {
    updateResumeAnalysis({
      uploaded: false,
      fileName: null,
      fileSize: null,
      fileType: null,
      uploadedAt: null,
      status: 'idle',
      score: null,
      strengths: [],
      weaknesses: [],
      missingKeywords: [],
      suggestions: [],
      recommendedSkills: [],
      roleMatch: null,
    })
    setFileError('')
    showToast('Resume removed')
  }

  return (
    <PageShell
      title="Resume analyzer"
      subtitle="Upload your resume to track score and get tailored prep"
      maxWidth={720}
    >
      <input
        id={INPUT_ID}
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="visually-hidden"
        onChange={onInputChange}
      />

      <Card>
        {!resumeAnalysis.uploaded ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '48px 24px',
              gap: 12,
              border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--radius-md)',
              backgroundColor: dragOver ? 'var(--primary-light)' : 'var(--surface-muted)',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              📄
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, margin: 0 }}>
              Upload your resume
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 340, lineHeight: 1.6, margin: 0 }}>
              PDF, DOC, or DOCX · Max 5 MB
              <br />
              Drag and drop here, or choose a file
            </p>

            {fileError && (
              <p style={{ color: 'var(--danger-text)', fontSize: 13, margin: '4px 0 0' }} role="alert">
                {fileError}
              </p>
            )}

            <label htmlFor={INPUT_ID} style={{ marginTop: 8, cursor: 'pointer' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 18px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid var(--primary)',
              }}>
                Choose file
              </span>
            </label>
          </div>
        ) : (
          <div>
            <div style={{
              padding: '16px 18px',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 4px' }}>
                {resumeAnalysis.fileName}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
                {formatBytes(resumeAnalysis.fileSize)} · Uploaded{' '}
                {resumeAnalysis.uploadedAt
                  ? new Date(resumeAnalysis.uploadedAt).toLocaleDateString()
                  : '—'}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 12 }}>
                Resume score:{' '}
                <strong>{resumeAnalysis.score != null ? `${resumeAnalysis.score}%` : '—'}</strong>
              </p>
            </div>

            {resumeAnalysis.status === 'uploaded' && resumeAnalysis.score == null && (
              <p style={{
                color: 'var(--info-text)', fontSize: 13, padding: '12px 14px',
                backgroundColor: 'var(--info-bg)', border: '1px solid var(--info-border)',
                borderRadius: 8, marginBottom: 16,
              }}>
                Resume analysis will be available after AI backend connection.
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button onClick={runAnalysis} loading={analyzing} disabled={analyzing}>
                Analyze resume
              </Button>
              <label htmlFor={INPUT_ID} style={{ cursor: 'pointer' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontWeight: 600,
                  border: '1px solid var(--border-strong)',
                }}>
                  Replace resume
                </span>
              </label>
              <Button variant="ghost" onClick={clearResume}>Remove</Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
            </div>
          </div>
        )}
      </Card>
    </PageShell>
  )
}
