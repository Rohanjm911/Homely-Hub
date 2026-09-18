import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { planTrip } from '../features/ai/aiSlice';
import PropertyCard from '../components/PropertyCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  Compass,
  Clock,
  Sun,
  Sunset,
  Moon,
  ArrowRight,
  CheckCircle2,
  Download,
  PieChart,
  TrendingUp,
  FileText,
  Utensils,
  Car,
  Ticket,
  Home,
  Check,
} from 'lucide-react';

const presetDestinations = [
  { city: 'Goa', budget: 25000, days: 4, interests: 'Beaches, seafood, watersports, nightlife' },
  { city: 'Manali', budget: 18000, days: 4, interests: 'Snow peaks, cafes, cedar forests, adventure' },
  { city: 'Jaipur', budget: 16000, days: 3, interests: 'Royal palaces, local bazaars, Rajasthani cuisine' },
  { city: 'Mumbai', budget: 30000, days: 3, interests: 'Sea view, colonial heritage, fine dining' },
];

const AITripPlannerPage = () => {
  const dispatch = useDispatch();
  const { tripPlan, matchingStays, generatingTrip, tripError } = useSelector((state) => state.ai);

  const [destination, setDestination] = useState('Goa');
  const [budget, setBudget] = useState('25000');
  const [days, setDays] = useState('4');
  const [interests, setInterests] = useState('Beach relaxation, authentic seafood shacks, sunsets');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const pdfExportRef = useRef(null);

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!destination || !budget || !days) {
      alert('Please provide destination, budget, and number of days.');
      return;
    }

    dispatch(
      planTrip({
        destination,
        budget: Number(budget),
        days: Number(days),
        interests,
      })
    );
  };

  const applyPreset = (preset) => {
    setDestination(preset.city);
    setBudget(preset.budget.toString());
    setDays(preset.days.toString());
    setInterests(preset.interests);
  };

  // Compute detailed dynamic expenses breakdown
  const numDays = Number(tripPlan?.days || days || 4);
  const totalBudgetInt = Number(tripPlan?.totalBudget ? String(tripPlan.totalBudget).replace(/[^0-9]/g, '') : budget) || 25000;
  
  // Standard travel expense ratio estimation
  const stayCost = Math.round(totalBudgetInt * 0.40);
  const foodCost = Math.round(totalBudgetInt * 0.25);
  const transitCost = Math.round(totalBudgetInt * 0.18);
  const activityCost = Math.round(totalBudgetInt * 0.12);
  const emergencyCost = totalBudgetInt - (stayCost + foodCost + transitCost + activityCost);

  const expenseCategories = [
    { label: 'Accommodation & Stays', amount: stayCost, percentage: 40, color: '#0284c7', icon: Home, desc: 'HomelyHub verified stay allocations' },
    { label: 'Dining & Local Cuisine', amount: foodCost, percentage: 25, color: '#f59e0b', icon: Utensils, desc: 'Breakfast, lunch, seafood & cafe dining' },
    { label: 'Local Transit & Cabs', amount: transitCost, percentage: 18, color: '#10b981', icon: Car, desc: 'Scooter rentals, auto-rickshaws & airport cabs' },
    { label: 'Activities & Sightseeing', amount: activityCost, percentage: 12, color: '#8b5cf6', icon: Ticket, desc: 'Monument tickets, watersports & entries' },
    { label: 'Contingency & Shopping', amount: emergencyCost, percentage: 5, color: '#ec4899', icon: IndianRupee, desc: 'Souvenirs, emergencies & sundries' },
  ];

  const handleExportPDF = () => {
    if (!tripPlan) return;
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Helper function to check page overflow
      const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin - 8) {
          addFooter(doc.internal.getNumberOfPages());
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      const addFooter = (pageNum) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('HomelyHub • AI Travel & Verified Stays Platform', margin, pageHeight - 8);
        doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      };

      // --- 1. HEADER BRANDING ---
      doc.setFillColor(2, 132, 199); // Primary Sky-Blue
      doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('HomelyHub Travel Itinerary & Budget Plan', margin + 6, y + 8);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(224, 242, 254);
      doc.text(`${destination}  •  ${numDays} Days  •  Budget: ${tripPlan.totalBudget || `INR ${totalBudgetInt}`}`, margin + 6, y + 14);

      y += 24;

      // --- 2. JOURNEY OVERVIEW CARD ---
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(tripPlan.tripTitle || `${numDays}-Day ${destination} Expedition`, margin + 5, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const summaryLines = doc.splitTextToSize(tripPlan.summary || '', contentWidth - 10);
      doc.text(summaryLines.slice(0, 2), margin + 5, y + 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(2, 132, 199);
      doc.text(`Vibes: ${tripPlan.interests || interests}   |   Nightly Stay Limit: ${tripPlan.nightlyBudget || `INR ${Math.floor(totalBudgetInt / numDays)}`}`, margin + 5, y + 21);

      y += 30;

      // --- 3. BUDGET ALLOCATION GRAPH & EXPENSE TABLE ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Cost Breakdown & Expense Estimate', margin, y);
      y += 5;

      // Visual Stacked Bar Graph
      let barX = margin;
      const barHeight = 6;
      expenseCategories.forEach((cat) => {
        const segWidth = (cat.percentage / 100) * contentWidth;
        // Convert hex color to rgb
        const hex = cat.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        doc.setFillColor(r, g, b);
        doc.rect(barX, y, segWidth, barHeight, 'F');
        barX += segWidth;
      });

      y += 9;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('CATEGORY', margin + 3, y + 4.8);
      doc.text('DETAILS', margin + 55, y + 4.8);
      doc.text('SHARE', margin + 125, y + 4.8, { align: 'right' });
      doc.text('EST. AMOUNT', margin + contentWidth - 3, y + 4.8, { align: 'right' });
      y += 7;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      expenseCategories.forEach((cat, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250);
        doc.rect(margin, y, contentWidth, 6.5, 'F');
        
        // Category color dot
        const hex = cat.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        doc.setFillColor(r, g, b);
        doc.circle(margin + 4, y + 3.2, 1.3, 'F');

        doc.setTextColor(15, 23, 42);
        doc.text(cat.label, margin + 7, y + 4.4);
        doc.setTextColor(100, 116, 139);
        doc.text(cat.desc, margin + 55, y + 4.4);
        doc.setTextColor(2, 132, 199);
        doc.text(`${cat.percentage}%`, margin + 125, y + 4.4, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`INR ${cat.amount.toLocaleString()}`, margin + contentWidth - 3, y + 4.4, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 6.5;
      });

      // Total Row
      doc.setFillColor(240, 249, 255);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(3, 105, 161);
      doc.text(`Average Daily Expenditure Target: INR ${Math.round(totalBudgetInt / numDays).toLocaleString()} / day`, margin + 3, y + 4.8);
      doc.text(`Total: INR ${totalBudgetInt.toLocaleString()}`, margin + contentWidth - 3, y + 4.8, { align: 'right' });
      y += 13;

      // --- 4. DAY-BY-DAY ITINERARY ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Day-by-Day Travel Schedule', margin, y);
      y += 6;

      if (tripPlan.itinerary && Array.isArray(tripPlan.itinerary)) {
        tripPlan.itinerary.forEach((dayPlan) => {
          checkPageBreak(38);

          // Day Title Bar
          doc.setFillColor(2, 132, 199);
          doc.roundedRect(margin, y, contentWidth, 6, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(255, 255, 255);
          doc.text(`DAY ${dayPlan.day}: ${dayPlan.title || ''}`, margin + 3, y + 4.2);
          if (dayPlan.estimatedDailyBudget) {
            doc.text(`Budget: ${dayPlan.estimatedDailyBudget}`, margin + contentWidth - 3, y + 4.2, { align: 'right' });
          }
          y += 8;

          // Morning Block
          doc.setFillColor(255, 247, 237); // Light Orange
          doc.rect(margin, y, contentWidth, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(194, 65, 12);
          doc.text('MORNING:', margin + 2, y + 3.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const morningLines = doc.splitTextToSize(dayPlan.morning || '', contentWidth - 25);
          doc.text(morningLines, margin + 22, y + 3.5);
          y += Math.max(7, morningLines.length * 3.5 + 2);

          // Afternoon Block
          doc.setFillColor(240, 249, 255); // Light Blue
          doc.rect(margin, y, contentWidth, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(3, 105, 161);
          doc.text('AFTERNOON:', margin + 2, y + 3.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const afternoonLines = doc.splitTextToSize(dayPlan.afternoon || '', contentWidth - 25);
          doc.text(afternoonLines, margin + 22, y + 3.5);
          y += Math.max(7, afternoonLines.length * 3.5 + 2);

          // Evening Block
          doc.setFillColor(250, 245, 255); // Light Purple
          doc.rect(margin, y, contentWidth, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(126, 34, 206);
          doc.text('EVENING:', margin + 2, y + 3.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const eveningLines = doc.splitTextToSize(dayPlan.evening || '', contentWidth - 25);
          doc.text(eveningLines, margin + 22, y + 3.5);
          y += Math.max(7, eveningLines.length * 3.5 + 4);
        });
      }

      // Add footers to all generated pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i);
      }

      doc.save(`HomelyHub_${destination.replace(/\s+/g, '_')}_${numDays}Days_Plan.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Top Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)',
        color: '#ffffff',
        padding: '3.5rem 2.5rem',
        marginBottom: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(49, 46, 129, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {/* Subtle decorative glow circles */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '20%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.84rem',
            fontWeight: 700,
            letterSpacing: '0.3px',
            marginBottom: '1.25rem',
          }}>
            <Sparkles size={16} color="#38bdf8" />
            <span>AI Travel Architect & Stays</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            color: '#ffffff',
            letterSpacing: '-0.03em',
          }}>
            Craft Your Perfect Getaway
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#e0e7ff', lineHeight: 1.6, maxWidth: '620px' }}>
            Enter your dream destination and budget. Our AI calculates itemized expenses, maps day-by-day schedules, and pairs you with verified HomelyHub stays matching your nightly budget limit.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(330px, 1fr) minmax(0, 2.2fr)',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Input Form & Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card: Preferences Form */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#ede9fe',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Compass size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Trip Preferences
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Configure parameters for your itinerary</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Destination
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                }}>
                  <MapPin size={18} color="#6366f1" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa, Manali, Jaipur, Mumbai"
                    required
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                    Total Budget (₹)
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                  }}>
                    <span style={{ fontWeight: 800, color: '#6366f1', fontSize: '1.1rem' }}>₹</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                    Duration (Days)
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                  }}>
                    <Calendar size={18} color="#6366f1" />
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Vibes & Interests
                </label>
                <textarea
                  rows={3}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Sea view, colonial architecture, beach clubs, street food"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#0f172a',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Nightly Budget Dynamic Insight Badge */}
              {budget && days && Number(days) > 0 && (
                <div style={{
                  backgroundColor: '#f5f3ff',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '14px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.84rem',
                  color: '#5b21b6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    ✨ Stay Target
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: '#6d28d9' }}>
                    ₹{Math.floor(Number(budget) / Number(days)).toLocaleString()} / night
                  </strong>
                </div>
              )}

              <button
                type="submit"
                disabled={generatingTrip}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: generatingTrip ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease',
                  marginTop: '0.25rem',
                }}
                onMouseOver={(e) => { if (!generatingTrip) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { if (!generatingTrip) e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Sparkles size={18} />
                {generatingTrip ? 'Generating Itinerary & Matching Stays...' : 'Generate AI Plan'}
              </button>
            </form>
          </div>

          {/* Quick Preset Ideas */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 15px -2px rgba(15, 23, 42, 0.04)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>⚡</span> Trending Itineraries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {presetDestinations.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="card-hover-effect"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f3ff';
                    e.currentTarget.style.borderColor = '#ddd6fe';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#f1f5f9';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    <span>{p.city}</span>
                    <span style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 800 }}>₹{p.budget.toLocaleString()} • {p.days}d</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>{p.interests}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Day-by-Day Itinerary + Matching Stays */}
        <div>
          {generatingTrip ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '5rem 2.5rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                border: '4px solid #e0e7ff',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                AI Travel Architect is building your journey...
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '440px', lineHeight: 1.6 }}>
                Computing expense allocations, generating balanced daily activity tracks, and matching verified HomelyHub properties.
              </p>
            </div>
          ) : tripPlan ? (
            <div>
              {/* Header Action Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
                    {tripPlan.tripTitle || `${tripPlan.days}-Day ${tripPlan.destination} Journey`}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Complete schedule and verified stays strictly matching your pace and budget.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    padding: '0.85rem 1.6rem',
                    borderRadius: '14px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: isExportingPdf ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => { if (!isExportingPdf) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { if (!isExportingPdf) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Download size={19} />
                  {isExportingPdf ? 'Preparing Document...' : 'Export Plan to PDF'}
                </button>
              </div>

              {/* REPORT CONTAINER */}
              <div
                ref={pdfExportRef}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '28px',
                  padding: '2.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.06)',
                  marginBottom: '3rem',
                }}
              >
                {/* Official Brand Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #f1f5f9',
                  paddingBottom: '1.5rem',
                  marginBottom: '1.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                    }}>
                      <Compass size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        Homely<span style={{ color: '#0284c7' }}>Hub</span> Travel Itinerary
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        AI Journey & Expenses Report
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Destination & Duration</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                      {destination} • {numDays} Days
                    </div>
                  </div>
                </div>

                {/* Plan Overview Hero Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  padding: '1.5rem 1.75rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '2rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {tripPlan.tripTitle || `${tripPlan.days}-Day ${tripPlan.destination} Expedition`}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #bae6fd' }}>
                        Budget: {tripPlan.totalBudget}
                      </span>
                      <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid #e9d5ff' }}>
                        Nightly Stay Cap: {tripPlan.nightlyBudget}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.65, marginBottom: '0.85rem' }}>
                    {tripPlan.summary}
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    Focus & Themes: <strong style={{ color: '#0f172a' }}>{tripPlan.interests}</strong>
                  </div>
                </div>

                {/* EXPENSES BREAKDOWN & VISUAL GRAPH SECTION */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  border: '1.5px solid #f1f5f9',
                  boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.03)',
                  marginBottom: '2.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        FINANCIAL ALLOCATION
                      </div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        Itemized Expense Estimate
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Total Estimated Budget</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7' }}>
                        ₹{totalBudgetInt.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Visual Multi-Segment Graph Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', height: '16px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#f1f5f9', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                      {expenseCategories.map((cat, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                            transition: 'width 0.4s ease',
                          }}
                          title={`${cat.label}: ₹${cat.amount.toLocaleString()} (${cat.percentage}%)`}
                        />
                      ))}
                    </div>

                    {/* Graph Legend Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.85rem' }}>
                      {expenseCategories.map((cat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                          <div style={{ width: '9px', height: '9px', borderRadius: '3px', backgroundColor: cat.color }} />
                          <span>{cat.label} ({cat.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clean Formatted Expense Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                          <th style={{ padding: '0.8rem 1rem', fontWeight: 800 }}>Category</th>
                          <th style={{ padding: '0.8rem 1rem', fontWeight: 800 }}>Details & Scope</th>
                          <th style={{ padding: '0.8rem 1rem', fontWeight: 800, textAlign: 'right' }}>Share</th>
                          <th style={{ padding: '0.8rem 1rem', fontWeight: 800, textAlign: 'right' }}>Estimated Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseCategories.map((cat, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                              <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: cat.color, marginRight: '8px' }} />
                              {cat.label}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{cat.desc}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: cat.color }}>{cat.percentage}%</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>₹{cat.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: '#f0f9ff', fontWeight: 800, borderTop: '2px solid #bae6fd' }}>
                          <td colSpan={3} style={{ padding: '0.85rem 1rem', color: '#0369a1' }}>
                            Target Daily Spend Limit (All In)
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#0284c7', fontSize: '1rem' }}>
                            ₹{Math.round(totalBudgetInt / numDays).toLocaleString()} / day
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Day-by-Day Itinerary Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      Day-by-Day Travel Schedule
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                      Custom itinerary for {destination} ({numDays} Days)
                    </span>
                  </div>

                  {tripPlan.itinerary?.map((dayPlan) => (
                    <div
                      key={dayPlan.day}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '18px',
                        padding: '1.5rem',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 4px 10px -2px rgba(15, 23, 42, 0.03)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '8px',
                            letterSpacing: '0.3px',
                          }}>
                            DAY {dayPlan.day}
                          </span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                            {dayPlan.title || `Day ${dayPlan.day}`}
                          </span>
                        </div>
                        {dayPlan.estimatedDailyBudget && (
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#059669',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                          }}>
                            Est: {dayPlan.estimatedDailyBudget}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                        {/* Morning */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          backgroundColor: '#fff7ed',
                          padding: '0.85rem 1.1rem',
                          borderRadius: '12px',
                          border: '1px solid #fed7aa',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '105px', flexShrink: 0, color: '#c2410c', fontWeight: 800, fontSize: '0.85rem' }}>
                            <Sun size={17} /> Morning
                          </div>
                          <div style={{ color: '#334155', lineHeight: 1.55 }}>{dayPlan.morning}</div>
                        </div>

                        {/* Afternoon */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          backgroundColor: '#f0f9ff',
                          padding: '0.85rem 1.1rem',
                          borderRadius: '12px',
                          border: '1px solid #bae6fd',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '105px', flexShrink: 0, color: '#0369a1', fontWeight: 800, fontSize: '0.85rem' }}>
                            <Sunset size={17} /> Afternoon
                          </div>
                          <div style={{ color: '#334155', lineHeight: 1.55 }}>{dayPlan.afternoon}</div>
                        </div>

                        {/* Evening */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          backgroundColor: '#faf5ff',
                          padding: '0.85rem 1.1rem',
                          borderRadius: '12px',
                          border: '1px solid #e9d5ff',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '105px', flexShrink: 0, color: '#7e22ce', fontWeight: 800, fontSize: '0.85rem' }}>
                            <Moon size={17} /> Evening
                          </div>
                          <div style={{ color: '#334155', lineHeight: 1.55 }}>{dayPlan.evening}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer on Document */}
                <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '2rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                  Generated with HomelyHub • Verified Stays & Zero-Double Booking Protection
                </div>
              </div>

              {/* Matching Stays Section - COMPLETELY SEPARATE FROM PDF EXPORT */}
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                    Stays Matching Your Nightly Budget
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    HomelyHub properties in {destination} where price per night fits comfortably within {tripPlan.nightlyBudget}
                  </p>
                </div>

                {matchingStays.length === 0 ? (
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '0.95rem',
                  }}>
                    No stays found directly under that budget in this destination. Check our Explore Stays catalog!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {matchingStays.map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '4.5rem 2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.04)',
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                backgroundColor: '#f5f3ff',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <Compass size={36} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                Your Custom Journey Awaits
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Fill in your destination, total budget, and number of days to let our AI Travel Architect generate a tailored day-by-day schedule paired with matching HomelyHub stays.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  color: '#ffffff',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Plan 4 Days in Goa (₹25,000)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITripPlannerPage;
