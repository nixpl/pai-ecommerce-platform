import { useEffect, useState } from 'react';
import {
  createAddress,
  createProfile,
  deleteAddress,
  fetchAddresses,
  fetchMyProfile,
  updateProfile
} from '../api/profile';
import { Alert, LoadingSpinner } from '../components/ui';

const emptyProfile = { first_name: '', last_name: '', phone: '' };
const emptyAddress = {
  street: '',
  building_number: '',
  city: '',
  zip_code: '',
  country: 'Polska'
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const prof = await fetchMyProfile();
      setProfile(prof);
      setProfileForm({
        first_name: prof.first_name,
        last_name: prof.last_name,
        phone: prof.phone
      });
      setNeedsProfile(false);
      const addrs = await fetchAddresses();
      setAddresses(addrs);
    } catch (err) {
      if (err.status === 404) {
        setNeedsProfile(true);
        setProfile(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (needsProfile) {
        const created = await createProfile(profileForm);
        setProfile(created);
        setNeedsProfile(false);
      } else {
        const updated = await updateProfile(profileForm);
        setProfile(updated);
      }
      setSuccess('Profil zapisany.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createAddress(addressForm);
      setAddresses((prev) => [...prev, created]);
      setAddressForm(emptyAddress);
      setSuccess('Adres dodany.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    setError(null);
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setSuccess('Adres usunięty.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Ładowanie profilu…" />;

  return (
    <div className="page profile-page">
      <h1>Mój profil</h1>
      <Alert message={error} onClose={() => setError(null)} />
      <Alert message={success} type="success" onClose={() => setSuccess(null)} />

      <div className="profile-grid">
        <section className="card">
          <h2>{needsProfile ? 'Utwórz profil' : 'Dane osobowe'}</h2>
          {needsProfile && (
            <p className="text-muted">
              Profil jest wymagany przed dodaniem adresów dostawy.
            </p>
          )}
          <form onSubmit={handleProfileSubmit} className="stack-form">
            <label>
              Imię
              <input
                className="input"
                value={profileForm.first_name}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, first_name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Nazwisko
              <input
                className="input"
                value={profileForm.last_name}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, last_name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Telefon
              <input
                className="input"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Zapisywanie…' : needsProfile ? 'Utwórz profil' : 'Zapisz zmiany'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Adresy dostawy</h2>
          {!profile && !needsProfile ? (
            <p className="text-muted">Najpierw utwórz profil.</p>
          ) : (
            <>
              {addresses.length === 0 ? (
                <p className="text-muted">Brak zapisanych adresów.</p>
              ) : (
                <ul className="address-cards">
                  {addresses.map((addr) => (
                    <li key={addr.id} className="address-card">
                      <p>
                        {addr.street} {addr.building_number}
                        <br />
                        {addr.zip_code} {addr.city}, {addr.country}
                      </p>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        Usuń
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!needsProfile && (
                <form onSubmit={handleAddressSubmit} className="stack-form address-form">
                  <h3>Dodaj adres</h3>
                  <label>
                    Ulica
                    <input
                      className="input"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, street: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label>
                    Nr budynku
                    <input
                      className="input"
                      value={addressForm.building_number}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, building_number: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Miasto
                      <input
                        className="input"
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm((f) => ({ ...f, city: e.target.value }))
                        }
                        required
                      />
                    </label>
                    <label>
                      Kod pocztowy
                      <input
                        className="input"
                        value={addressForm.zip_code}
                        onChange={(e) =>
                          setAddressForm((f) => ({ ...f, zip_code: e.target.value }))
                        }
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Kraj
                    <input
                      className="input"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm((f) => ({ ...f, country: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-secondary" disabled={saving}>
                    Dodaj adres
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
