import React, { useState, useEffect } from 'react'
import { JobTemplate } from '../types/template'
import { JobInput } from '../calculators/types'
import {
  getAllTemplates,
  saveTemplate,
  deleteTemplate,
  createTemplateFromJob,
  incrementTemplateUsage,
} from '../services/templates'
import { formatCurrency } from '../utils/format'

interface Props {
  onSelectTemplate?: (template: JobTemplate) => void
  currentJob?: JobInput
  onSaveAsTemplate?: (name: string, description: string) => void
}

export const TemplatesManager: React.FC<Props> = ({
  onSelectTemplate,
  currentJob,
  onSaveAsTemplate,
}) => {
  const [templates, setTemplates] = useState<JobTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveFormData, setSaveFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    const allTemplates = getAllTemplates()
    setTemplates(allTemplates)
  }

  const handleSaveTemplate = () => {
    if (!currentJob || !saveFormData.name.trim()) {
      alert('שם התבנית הוא חובה')
      return
    }

    const template = createTemplateFromJob(
      saveFormData.name,
      saveFormData.description || undefined,
      currentJob
    )
    saveTemplate(template)
    loadTemplates()
    setShowSaveForm(false)
    setSaveFormData({ name: '', description: '' })
    
    if (onSaveAsTemplate) {
      onSaveAsTemplate(saveFormData.name, saveFormData.description)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את התבנית הזו?')) {
      deleteTemplate(id)
      loadTemplates()
    }
  }

  const handleUseTemplate = (template: JobTemplate) => {
    incrementTemplateUsage(template.id)
    if (onSelectTemplate) {
      onSelectTemplate(template)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="templates-manager-container">
      <div className="templates-manager-header">
        <div>
          <h2>📋 תבניות עבודות</h2>
          <p className="muted">שמור עבודות חוזרות לשימוש מהיר</p>
        </div>
        {currentJob && (
          <button
            type="button"
            className="wizard-btn-primary"
            onClick={() => setShowSaveForm(true)}
          >
            💾 שמור כתבנית
          </button>
        )}
      </div>

      {showSaveForm && currentJob && (
        <div className="template-form-card">
          <h3>שמור עבודה כתבנית</h3>
          <div className="wizard-field">
            <label>שם התבנית *</label>
            <input
              type="text"
              value={saveFormData.name}
              onChange={(e) => setSaveFormData({ ...saveFormData, name: e.target.value })}
              placeholder="לדוגמה: שולחן מחשב סטנדרטי"
              autoFocus
            />
          </div>
          <div className="wizard-field">
            <label>תיאור (לא חובה)</label>
            <textarea
              value={saveFormData.description}
              onChange={(e) => setSaveFormData({ ...saveFormData, description: e.target.value })}
              placeholder="תיאור קצר של התבנית..."
              rows={3}
            />
          </div>
          <div className="wizard-actions">
            <button
              type="button"
              className="wizard-btn-secondary"
              onClick={() => {
                setShowSaveForm(false)
                setSaveFormData({ name: '', description: '' })
              }}
            >
              ביטול
            </button>
            <button type="button" className="wizard-btn-primary" onClick={handleSaveTemplate}>
              שמור תבנית
            </button>
          </div>
        </div>
      )}

      <div className="templates-search">
        <input
          type="text"
          placeholder="חפש תבנית..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="templates-grid">
        {filteredTemplates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>אין תבניות</h3>
            <p>
              {currentJob
                ? 'שמור את העבודה הנוכחית כתבנית כדי להשתמש בה שוב'
                : 'צור תבנית מעבודה קיימת'}
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-card-header">
                <div>
                  <h3>{template.name}</h3>
                  {template.description && (
                    <p className="template-description">{template.description}</p>
                  )}
                </div>
                <div className="template-actions">
                  {onSelectTemplate && (
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleUseTemplate(template)}
                      title="השתמש בתבנית"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-icon delete"
                    onClick={() => handleDelete(template.id)}
                    title="מחק"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="template-card-body">
                <div className="template-info">
                  <div className="info-row">
                    <span className="info-label">סוג:</span>
                    <span className="info-value">
                      {template.jobInput.projectType === 'desk' && 'שולחן'}
                      {template.jobInput.projectType === 'cabinet' && 'ארון'}
                      {template.jobInput.projectType === 'sideboard' && 'שידה'}
                      {template.jobInput.projectType === 'dresser' && 'קומדייה'}
                      {template.jobInput.projectType === 'shelf' && 'מדף'}
                      {template.jobInput.projectType === 'custom' && 'מותאם אישית'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">מידות:</span>
                    <span className="info-value">
                      {template.jobInput.widthCm}×{template.jobInput.depthCm}×
                      {template.jobInput.heightCm} ס״מ
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">חומר:</span>
                    <span className="info-value">
                      {template.jobInput.material === 'mdf' && 'MDF'}
                      {template.jobInput.material === 'plywood' && 'סנדוויץ'}
                      {template.jobInput.material === 'solid' && 'עץ מלא'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">עובי:</span>
                    <span className="info-value">{template.jobInput.thicknessMm} מ״מ</span>
                  </div>
                  {template.jobInput.drawers > 0 && (
                    <div className="info-row">
                      <span className="info-label">מגירות:</span>
                      <span className="info-value">{template.jobInput.drawers}</span>
                    </div>
                  )}
                  {template.jobInput.doors > 0 && (
                    <div className="info-row">
                      <span className="info-label">דלתות:</span>
                      <span className="info-value">{template.jobInput.doors}</span>
                    </div>
                  )}
                </div>
                <div className="template-footer">
                  <span className="template-usage">
                    שימוש: {template.usageCount} פעמים
                  </span>
                  <span className="template-date">
                    עודכן: {new Date(template.updatedAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

