import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, PhotoIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo allo maalam.png';
import InputField from '../components/InputField';
import { authService } from '../services/authService';

function RoleToggle({ role, setRole, setEtapeArtisan }) {
  const toggleRole = (newRole) => {
    setRole(newRole);
    setEtapeArtisan(1);
  };

  return (
    <motion.div
      layout
      className="flex justify-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="inline-flex p-1 bg-gray-100 rounded-full shadow-inner">
        <motion.button
          layout
          onClick={() => toggleRole('client')}
          className={`px-6 py-2 rounded-full font-medium ${
            role === 'client' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-600'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Client
        </motion.button>
        <motion.button
          layout
          onClick={() => toggleRole('artisan')}
          className={`px-6 py-2 rounded-full font-medium ${
            role === 'artisan' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-600'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Artisan
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ville: '',
    zone: '',
    profileImage: null,
    description: '',
    categorie: '',
    service: '',
    images: [],
    societe: ''
  });

  const [villes, setVilles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);
  const [errors, setErrors] = useState({});
  const [etapeArtisan, setEtapeArtisan] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [villesRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:8000/api/villes'),
          fetch('http://localhost:8000/api/categories')
        ]);
        
        const villesData = await villesRes.json();
        const categoriesData = await categoriesRes.json();
        
        setVilles(villesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setErrors({ general: 'Erreur de chargement des données' });
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.categorie) {
      const selectedCat = categories.find(c => c.name === formData.categorie);
      setServices(selectedCat?.services || []);
      setFormData(prev => ({ ...prev, service: '' }));
    }
  }, [formData.categorie, categories]);

  useEffect(() => {
    const fetchZones = async () => {
      if (formData.ville) {
        setLoadingZones(true);
        try {
          const response = await fetch(`http://localhost:8000/api/zones?ville=${formData.ville}`);
          const zonesData = await response.json();
          setZones(zonesData);
        } catch (error) {
          console.error('Erreur lors du chargement des zones:', error);
          setErrors(prevErrors => ({ ...prevErrors, zone: 'Erreur de chargement des zones' }));
        } finally {
          setLoadingZones(false);
        }
      } else {
        setZones([]);
      }
    };
  
    fetchZones();
  }, [formData.ville]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nom complet est requis';
    if (!formData.email.trim()) newErrors.email = 'Email est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone est requis';
    if (!formData.ville) newErrors.ville = 'Ville est requise';
    if (!formData.zone) newErrors.zone = 'Zone/Quartier est requis';
    if (!formData.password) newErrors.password = 'Mot de passe est requis';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.categorie) newErrors.categorie = 'Catégorie est requise';
    if (!formData.service) newErrors.service = 'Service est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (role === 'artisan') {
      if (etapeArtisan === 1 && !validateStep1()) {
        setIsSubmitting(false);
        return;
      }
      if (etapeArtisan === 2 && !validateStep2()) {
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!validateStep1()) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.confirmPassword);
      formDataToSend.append('ville', formData.ville);
      formDataToSend.append('zone', formData.zone);
      formDataToSend.append('role', role);
      
      if (formData.profileImage) {
        formDataToSend.append('profile_image', formData.profileImage);
      }

      if (role === 'artisan') {
        if (formData.description) formDataToSend.append('description', formData.description);
        formDataToSend.append('categorie', formData.categorie);
        formDataToSend.append('service', formData.service);
        if (formData.societe) formDataToSend.append('societe', formData.societe);
        
        if (formData.images.length > 0) {
          Array.from(formData.images).forEach((image, index) => {
            formDataToSend.append(`images[${index}]`, image);
          });
        }
      }

      const response = await authService.register(formDataToSend);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        navigate(response.redirect_to || (role === 'artisan' ? '/artisan/dashboard' : '/client/dashboard'));
      } else {
        setErrors({ 
          general: response.message || 'Erreur lors de l\'inscription',
          ...response.errors
        });
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setErrors({ 
        general: error.response?.data?.message || error.message || 'Erreur réseau'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ville') {
      setFormData(prev => ({ ...prev, ville: value, zone: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, profileImage: file }));
    setErrors({...errors, profileImage: ''});
    
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleMultiImageChange = (e) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files).slice(0, 4 - formData.images.length);
    if (filesArray.length === 0) return;

    setFormData(prev => ({ ...prev, images: [...prev.images, ...filesArray] }));

    const newPreviews = [];
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === filesArray.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const nextStep = () => validateStep1() && setEtapeArtisan(2);
  const prevStep = () => setEtapeArtisan(1);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-8">
          <div className="max-w-md text-center text-white">
            <img src={logo} alt="Logo" className="w-32 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Bienvenue sur Allo-Maalam</h1>
            <p className="text-lg">
              {role === 'client'
                ? 'Trouvez les artisans les plus qualifiés près de chez vous'
                : 'Développez votre activité et augmentez votre visibilité'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Inscrivez-vous</h2>
                <p className="mt-2 text-lg text-gray-600">Rejoignez notre communauté</p>
              </div>

              {errors.general && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              <RoleToggle 
                role={role} 
                setRole={setRole} 
                setEtapeArtisan={setEtapeArtisan} 
              />

              <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
                {(role === 'client' || etapeArtisan === 1) && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                      <label className="cursor-pointer group">
                        <div className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 ${errors.profileImage ? 'border-red-500' : 'border-gray-300'} group-hover:border-blue-500 transition-all`}>
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <PhotoIcon className="h-10 w-10" />
                              <span className="text-sm mt-1">Photo de profil</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          name="profileImage"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>

                    <InputField
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nom complet"
                      icon="user"
                      required
                      error={errors.name}
                    />

                    <InputField
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Adresse email"
                      icon="email"
                      required
                      error={errors.email}
                    />

                    <InputField
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      icon="phone"
                      required
                      error={errors.phone}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        type="select"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        placeholder="Ville"
                        required
                        error={errors.ville}
                        options={villes.map(v => ({ value: v.name, label: v.name }))}
                      />

                      <InputField
                        type="select"
                        name="zone"
                        value={formData.zone}
                        onChange={handleChange}
                        placeholder="Zone/Quartier"
                        required
                        error={errors.zone}
                        disabled={!formData.ville || loadingZones}
                        options={zones.map(z => ({ value: z.name, label: z.name }))}
                      />
                    </div>

                    <InputField
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mot de passe"
                      icon="password"
                      required
                      error={errors.password}
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      }
                    />

                    <InputField
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmer mot de passe"
                      icon="password"
                      required
                      error={errors.confirmPassword}
                    />

                    {role === 'artisan' && (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md text-lg font-medium flex items-center justify-center"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Continuer <ChevronRightIcon className="h-5 w-5 ml-2" />
                      </motion.button>
                    )}
                  </div>
                )}

                {role === 'artisan' && etapeArtisan === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        type="select"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        placeholder="Catégorie"
                        required
                        error={errors.categorie}
                        options={categories.map(c => ({ 
                          value: c.name, 
                          label: c.name 
                        }))}
                      />

                      <InputField
                        type="select"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        placeholder="Service"
                        required
                        error={errors.service}
                        disabled={!formData.categorie}
                        options={services.map(s => ({ 
                          value: s.name, 
                          label: s.name 
                        }))}
                      />
                    </div>

                    <InputField
                      type="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description (optionnel)"
                      rows={4}
                    />

                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Images de réalisations (max 4, optionnel)
                      </label>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <motion.div 
                            key={index} 
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                        
                        {formData.images.length < 4 && (
                          <motion.label 
                            className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="text-center p-4">
                              <PhotoIcon className="h-10 w-10 mx-auto text-gray-400" />
                              <span className="text-gray-500">Ajouter une image</span>
                              <span className="block text-xs text-gray-400">{formData.images.length}/4</span>
                            </div>
                            <input
                              type="file"
                              name="images"
                              onChange={handleMultiImageChange}
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </motion.label>
                        )}
                      </div>
                    </div>

                    <InputField
                      type="text"
                      name="societe"
                      value={formData.societe}
                      onChange={handleChange}
                      placeholder="Société (optionnel)"
                      icon="building"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 text-lg font-medium flex items-center justify-center"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <ChevronLeftIcon className="h-5 w-5 mr-2" /> Retour
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md text-lg font-medium ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                      >
                        {isSubmitting ? 'Enregistrement...' : 'Finaliser l\'inscription'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {role === 'client' && (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md text-lg font-medium ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Créer mon compte'}
                  </motion.button>
                )}
              </form>

              <div className="text-center text-lg text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Connectez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}