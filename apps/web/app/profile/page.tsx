'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useOrdersStore } from '@/features/orders/store';
import { useAddressStore } from '@/features/address/address-store';
import AddAddressModal from '@/components/checkout/AddAddressModal';
import {
  Package,
  MapPin,
  Heart,
  Bell,
  MessageCircle,
  Phone,
  ChevronRight,
  Leaf,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Edit3,
  Sprout,
  Droplets,
  Check,
  ShieldCheck,
  Warehouse,
} from 'lucide-react';

interface FarmProfile {
  acreage: number;
  soilType: string;
  primaryCrops: string;
  irrigationType: string;
  nearestMandi: string;
  khasraNumber: string;
}

const DEFAULT_FARM_PROFILE: FarmProfile = {
  acreage: 14.5,
  soilType: 'Black Cotton (Regur Soil)',
  primaryCrops: 'Soybean (JS-335), Bt Cotton, Sharbati Wheat',
  irrigationType: 'Solar Drip Fertigation & Tube Well',
  nearestMandi: 'Indore APMC Mandi (18 km)',
  khasraNumber: 'KH-492/2024-DH',
};

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const { orders } = useOrdersStore();
  const { addresses, setDefaultAddress, deleteAddress, selectAddress } = useAddressStore();
  const router = useRouter();

  const [signOutDialog, setSignOutDialog] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'farm'>('overview');

  // Farm Profile State with persistence
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(DEFAULT_FARM_PROFILE);
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  const [farmForm, setFarmForm] = useState<FarmProfile>(DEFAULT_FARM_PROFILE);
  const [farmSaveSuccess, setFarmSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('agritrade_farm_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFarmProfile(parsed);
        setFarmForm(parsed);
      }
    } catch {
      // fallback to default
    }
  }, []);

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmProfile(farmForm);
    localStorage.setItem('agritrade_farm_profile', JSON.stringify(farmForm));
    setIsEditingFarm(false);
    setFarmSaveSuccess(true);
    setTimeout(() => setFarmSaveSuccess(false), 3000);
  };

  const activeOrders = orders.filter((o) => ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const totalSpent = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSignOut = () => {
    signOut();
    router.replace('/welcome');
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 28, paddingBottom: 64 }}>
        {/* Profile Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B3D2E 0%, #062319 100%)',
            borderRadius: 14,
            padding: '28px 24px',
            marginBottom: 20,
            color: '#fff',
            boxShadow: '0 10px 25px -5px rgba(11, 61, 46, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? 'F'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                  {user?.name ?? 'Agrarian Member'}
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#86efac',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    padding: '2px 8px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={12} /> VERIFIED FARM GATE
                </span>
              </div>
              <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.8)', fontSize: 13.5 }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>
                {user?.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} strokeWidth={2} /> {user.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} strokeWidth={2} /> Dhar District, MP
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.12)',
              paddingTop: 16,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {[
              { label: 'Active Consignments', value: activeOrders.length },
              { label: 'Delivered Lots', value: deliveredOrders.length },
              { label: 'Total Procured', value: `₹${totalSpent >= 1000 ? (totalSpent / 1000).toFixed(1) + 'K' : totalSpent}` },
              { label: 'Holding Land', value: `${farmProfile.acreage} Acres` },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  padding: '0 4px',
                }}
              >
                <p style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 800, color: '#FDFBF7' }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            background: 'var(--color-surface)',
            padding: '6px',
            borderRadius: 10,
            border: '1px solid var(--color-divider)',
          }}
        >
          {[
            { id: 'overview', label: 'Account Overview', Icon: Package },
            { id: 'addresses', label: `Farm Gate Addresses (${addresses.length})`, Icon: MapPin },
            { id: 'farm', label: 'Farm Land & Agronomy', Icon: Sprout },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'var(--color-forest)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--color-text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save success toast banner */}
        {farmSaveSuccess && (
          <div
            className="slide-up"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} /> Farm specifications updated and synced with Mandi logistics dispatch!
          </div>
        )}

        {/* TAB 1: ACCOUNT OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Action Navigation Grid */}
            <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
              {[
                { label: 'My Consignments & Invoices', desc: `${orders.length} orders tracked with GST receipts`, href: '/orders', Icon: Package },
                { label: 'Certified Inputs Catalog', desc: 'Browse certified seed lots & nutrients', href: '/products', Icon: Sprout },
                { label: 'Live Mandi Market Feeds', desc: 'Real-time spot rates from Indore & Neemuch', href: '/home', Icon: Leaf },
                { label: 'Saved Wishlist', desc: 'High-yield hybrid varieties earmarked', href: '/products', Icon: Heart },
                { label: 'Agro Advisory & Support', desc: 'Crop disease helpline & Kisan Mitra chat', href: '#', Icon: MessageCircle },
              ].map(({ label, desc, href, Icon }, i, arr) => (
                <Link
                  key={label}
                  href={href}
                  id={`profile-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    textDecoration: 'none',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--color-divider)' : 'none',
                    background: 'var(--color-surface)',
                    transition: 'background 150ms ease',
                  }}
                  className="glass-card-hover"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'var(--color-brand-50, #f0fdf4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--color-forest)',
                    }}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {label}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>{desc}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={2} color="var(--color-text-tertiary)" />
                </Link>
              ))}
            </div>

            {/* Quick summary cards: Primary Address & Farm snapshot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Primary Address Preview */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 12,
                  border: '1px solid var(--color-divider)',
                  padding: '18px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Primary Delivery Destination
                  </span>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-forest)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Manage →
                  </button>
                </div>
                {addresses[0] ? (
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14 }}>{addresses[0].recipientName}</p>
                    <p style={{ margin: '0 0 4px', fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {addresses[0].addressLine}, {addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      Phone: {addresses[0].phone}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No delivery address configured.</p>
                )}
              </div>

              {/* Agronomic Profile Preview */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 12,
                  border: '1px solid var(--color-divider)',
                  padding: '18px 20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Farm Agronomy Snapshot
                  </span>
                  <button
                    onClick={() => setActiveTab('farm')}
                    style={{ background: 'none', border: 'none', color: '#D97706', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Details →
                  </button>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><strong>Holding:</strong> {farmProfile.acreage} Acres ({farmProfile.soilType})</div>
                  <div><strong>Key Crops:</strong> {farmProfile.primaryCrops}</div>
                  <div><strong>Logistics APMC:</strong> {farmProfile.nearestMandi}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 700 }}>Saved Farm Gate Destinations</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Manage delivery coordinates, village access roads, and contact numbers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                <Plus size={15} strokeWidth={2.5} /> Add Destination
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 10,
                    border: `1.5px solid ${addr.isDefault ? 'var(--color-forest)' : 'var(--color-border)'}`,
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{addr.recipientName}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'rgba(0,0,0,0.06)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {addr.tag}
                      </span>
                      {addr.isDefault && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '2px 8px',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Star size={11} fill="#166534" /> DEFAULT ADDRESS
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Set Default
                        </button>
                      )}
                      {addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: 6,
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            color: '#991B1B',
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete Address"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2, color: 'var(--color-forest)' }} />
                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text-tertiary)' }}>
                    <Phone size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                    Contact: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FARM LAND & AGRONOMY */}
        {activeTab === 'farm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 700 }}>Farm Land &amp; Agronomic Profile</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Calibrate fertilizer recommendations, bulk freight routing, and cooperative procurement.
                </p>
              </div>
              {!isEditingFarm ? (
                <button
                  type="button"
                  onClick={() => setIsEditingFarm(true)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                >
                  <Edit3 size={14} /> Edit Specifications
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingFarm(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Farm Profile Form / Display Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: 12,
                border: '1px solid var(--color-divider)',
                padding: '24px',
              }}
            >
              {isEditingFarm ? (
                <form onSubmit={handleSaveFarm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        TOTAL OPERATIONAL ACREAGE
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={farmForm.acreage}
                        onChange={(e) => setFarmForm({ ...farmForm, acreage: parseFloat(e.target.value) || 0 })}
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        SOIL PROFILE CLASSIFICATION
                      </label>
                      <select
                        value={farmForm.soilType}
                        onChange={(e) => setFarmForm({ ...farmForm, soilType: e.target.value })}
                        className="input-base"
                      >
                        <option value="Black Cotton (Regur Soil)">Black Cotton (Regur Soil)</option>
                        <option value="Alluvial Soil (Gangetic Plain)">Alluvial Soil</option>
                        <option value="Red & Yellow Sandy Loam">Red &amp; Yellow Sandy Loam</option>
                        <option value="Laterite Acidic Soil">Laterite Acidic Soil</option>
                        <option value="Clayey Loam (High Retention)">Clayey Loam</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        PRIMARY CROPS (KHARIF &amp; RABI)
                      </label>
                      <input
                        type="text"
                        value={farmForm.primaryCrops}
                        onChange={(e) => setFarmForm({ ...farmForm, primaryCrops: e.target.value })}
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        IRRIGATION INFRASTRUCTURE
                      </label>
                      <input
                        type="text"
                        value={farmForm.irrigationType}
                        onChange={(e) => setFarmForm({ ...farmForm, irrigationType: e.target.value })}
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        NEAREST APMC MANDI HUB &amp; DISTANCE
                      </label>
                      <input
                        type="text"
                        value={farmForm.nearestMandi}
                        onChange={(e) => setFarmForm({ ...farmForm, nearestMandi: e.target.value })}
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                        KHASRA / LAND REVENUE RECORD NO.
                      </label>
                      <input
                        type="text"
                        value={farmForm.khasraNumber}
                        onChange={(e) => setFarmForm({ ...farmForm, khasraNumber: e.target.value })}
                        className="input-base"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingFarm(false)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 18px', fontSize: 13 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '8px 22px', fontSize: 13, fontWeight: 700 }}
                    >
                      Save Farm Specifications
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)', flexShrink: 0 }}>
                      <Leaf size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Cultivable Acreage</span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700 }}>{farmProfile.acreage} Net Acres</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', flexShrink: 0 }}>
                      <Sprout size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Soil Classification</span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700 }}>{farmProfile.soilType}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', flexShrink: 0 }}>
                      <Droplets size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Irrigation Facility</span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700 }}>{farmProfile.irrigationType}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6d28d9', flexShrink: 0 }}>
                      <Warehouse size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Nearest APMC Mandi</span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700 }}>{farmProfile.nearestMandi}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', gridColumn: 'span 2' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce', flexShrink: 0 }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Crop Rotation Cycle</span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700 }}>{farmProfile.primaryCrops}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>Khasra Verification: <strong>{farmProfile.khasraNumber}</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Platform Info & Sign Out Footer */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 10,
              border: '1px solid var(--color-divider)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Leaf size={14} strokeWidth={2} color="var(--color-forest)" />
              AgriTrade Agrocommerce Enterprise v1.2
            </span>
            <span className="badge badge-forest">FARMER MEMBER</span>
          </div>

          <button
            id="profile-signout-btn"
            onClick={() => setSignOutDialog(true)}
            className="btn btn-secondary btn-full"
            style={{
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 14,
              borderColor: 'var(--color-error)',
              color: 'var(--color-error)',
              gap: 8,
            }}
          >
            <LogOut size={16} strokeWidth={2} />
            Sign Out of AgriTrade
          </button>
        </div>
      </div>

      {/* Add Address Modal Component */}
      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSuccess={(newAddr) => selectAddress(newAddr.id)}
      />

      {/* Sign Out Confirmation Dialog */}
      {signOutDialog && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            onClick={() => setSignOutDialog(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--color-surface)',
              borderRadius: 12,
              padding: '24px',
              width: '90%',
              maxWidth: 380,
              zIndex: 101,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Sign Out?</h3>
            <p style={{ margin: '0 0 20px', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              Are you sure you want to sign out of AgriTrade?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSignOutDialog(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                id="profile-confirm-signout-btn"
                onClick={handleSignOut}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14, background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
