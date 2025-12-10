import React, { useState, useEffect } from 'react'
import { MaterialType } from '../calculators/types'
import {
  PANEL_PRICES_PER_SQM,
  EDGE_BAND_PRICE_PER_METER,
  DRAWER_SLIDES_PRICE_PER_SET,
  HANDLE_PRICE,
  HINGE_PRICE,
  SCREW_BOX_PRICE,
  LABOR_PRICE_PER_HOUR,
  GLUE_PRICE_PER_KG,
  VARNISH_PRICE_PER_LITER,
  PAINT_PRICE_PER_LITER,
  SANDPAPER_PRICE_PER_SHEET,
} from '../config/pricing'
import { savePricing, getPricing, PricingConfig } from '../services/storage'

export const PricingManager: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig>({
    panels: PANEL_PRICES_PER_SQM,
    edgeBand: EDGE_BAND_PRICE_PER_METER,
    drawerSlides: DRAWER_SLIDES_PRICE_PER_SET,
    handle: HANDLE_PRICE,
    hinge: HINGE_PRICE,
    screws: SCREW_BOX_PRICE,
    labor: LABOR_PRICE_PER_HOUR,
    glue: GLUE_PRICE_PER_KG,
    varnish: VARNISH_PRICE_PER_LITER,
    paint: PAINT_PRICE_PER_LITER,
    sandpaper: SANDPAPER_PRICE_PER_SHEET,
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // טען מחירים שמורים
    const savedPricing = getPricing()
    if (savedPricing) {
      setPricing({
        panels: savedPricing.panels || pricing.panels,
        edgeBand: savedPricing.edgeBand || savedPricing.edgeBandPrice || pricing.edgeBand,
        drawerSlides: savedPricing.drawerSlides || savedPricing.drawerSlidesPrice || pricing.drawerSlides,
        handle: savedPricing.handle || savedPricing.handlePrice || pricing.handle,
        hinge: savedPricing.hinge || savedPricing.hingePrice || pricing.hinge,
        screws: savedPricing.screws || savedPricing.screwBoxPrice || pricing.screws,
        labor: savedPricing.labor || savedPricing.laborPricePerHour || pricing.labor,
        glue: savedPricing.glue || pricing.glue,
        varnish: savedPricing.varnish || pricing.varnish,
        paint: savedPricing.paint || pricing.paint,
        sandpaper: savedPricing.sandpaper || pricing.sandpaper,
      })
    }
  }, [])

  const handleSave = () => {
    savePricing(pricing)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setPricing({
      panels: PANEL_PRICES_PER_SQM,
      edgeBand: EDGE_BAND_PRICE_PER_METER,
      drawerSlides: DRAWER_SLIDES_PRICE_PER_SET,
      handle: HANDLE_PRICE,
      hinge: HINGE_PRICE,
      screws: SCREW_BOX_PRICE,
      labor: LABOR_PRICE_PER_HOUR,
      glue: GLUE_PRICE_PER_KG,
      varnish: VARNISH_PRICE_PER_LITER,
      paint: PAINT_PRICE_PER_LITER,
      sandpaper: SANDPAPER_PRICE_PER_SHEET,
    })
  }

  return (
    <div className="pricing-manager-container">
      <div className="pricing-manager-header">
        <h2>💰 ניהול מחירון</h2>
        <p className="muted">עדכן את המחירים לפי הספקים והשוק שלך</p>
      </div>

      <div className="pricing-sections">
        {/* לוחות */}
        <section className="pricing-section">
          <h3>🪵 לוחות (למטר רבוע)</h3>
          <div className="pricing-grid">
            <div className="pricing-item">
              <label>MDF</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.panels?.mdf || 0}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      panels: { ...(pricing.panels || {}), mdf: Number(e.target.value) } as Record<MaterialType, number>,
                    })
                  }
                />
                <span className="unit">₪/מ״ר</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>סנדוויץ</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.panels?.plywood || 0}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      panels: { ...(pricing.panels || {}), plywood: Number(e.target.value) } as Record<MaterialType, number>,
                    })
                  }
                />
                <span className="unit">₪/מ״ר</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>עץ מלא</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.panels?.solid || 0}
                  onChange={(e) =>
                    setPricing({
                      ...pricing,
                      panels: { ...(pricing.panels || {}), solid: Number(e.target.value) } as Record<MaterialType, number>,
                    })
                  }
                />
                <span className="unit">₪/מ״ר</span>
              </div>
            </div>
          </div>
        </section>

        {/* פרזול */}
        <section className="pricing-section">
          <h3>🔧 פרזול</h3>
          <div className="pricing-grid">
            <div className="pricing-item">
              <label>קנט (למטר)</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.edgeBand}
                  onChange={(e) =>
                    setPricing({ ...pricing, edgeBand: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/מ׳</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>מסילות מגירה (סט)</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.drawerSlides}
                  onChange={(e) =>
                    setPricing({ ...pricing, drawerSlides: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/סט</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>ידית</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.handle}
                  onChange={(e) =>
                    setPricing({ ...pricing, handle: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/יח׳</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>ציר דלת</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.hinge}
                  onChange={(e) =>
                    setPricing({ ...pricing, hinge: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/יח׳</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>קופסת ברגים</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.screws}
                  onChange={(e) =>
                    setPricing({ ...pricing, screws: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/קופסה</span>
              </div>
            </div>
          </div>
        </section>

        {/* עבודה */}
        <section className="pricing-section">
          <h3>👷 עבודה</h3>
          <div className="pricing-grid">
            <div className="pricing-item">
              <label>שעת עבודה</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.labor}
                  onChange={(e) =>
                    setPricing({ ...pricing, labor: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/שעה</span>
              </div>
            </div>
          </div>
        </section>

        {/* חומרים נוספים */}
        <section className="pricing-section">
          <h3>🧪 חומרים נוספים</h3>
          <div className="pricing-grid">
            <div className="pricing-item">
              <label>דבק עץ</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.glue}
                  onChange={(e) =>
                    setPricing({ ...pricing, glue: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/ק״ג</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>לכה</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.varnish}
                  onChange={(e) =>
                    setPricing({ ...pricing, varnish: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/ליטר</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>צבע</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.paint}
                  onChange={(e) =>
                    setPricing({ ...pricing, paint: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/ליטר</span>
              </div>
            </div>
            <div className="pricing-item">
              <label>נייר זכוכית</label>
              <div className="pricing-input-group">
                <input
                  type="number"
                  value={pricing.sandpaper}
                  onChange={(e) =>
                    setPricing({ ...pricing, sandpaper: Number(e.target.value) })
                  }
                />
                <span className="unit">₪/יריעה</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="pricing-actions">
        <button
          type="button"
          className="wizard-btn-secondary"
          onClick={handleReset}
        >
          🔄 איפוס לערכי ברירת מחדל
        </button>
        <button
          type="button"
          className="wizard-btn-primary"
          onClick={handleSave}
        >
          {saved ? '✅ נשמר!' : '💾 שמור מחירון'}
        </button>
      </div>
    </div>
  )
}

