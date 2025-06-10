import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, PhotoIcon, XMarkIcon, EyeIcon, EyeSlashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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
    societe: '',
    cin: null,
    diplomas: [],
    annees_experience: '',
    terms_accepted: false
  });

  const [villes, setVilles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [etapeArtisan, setEtapeArtisan] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [cinPreview, setCinPreview] = useState(null);
  const [diplomaPreviews, setDiplomaPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [villesRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:8000/api/villes'),
          fetch('http://localhost:8000/api/categories')
        ]);

        if (!villesRes.ok || !categoriesRes.ok) {
          throw new Error('Erreur de chargement des données');
        }

        const [villesData, categoriesData] = await Promise.all([
          villesRes.json(),
          categoriesRes.json()
        ]);
        
        setVilles(villesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur:', error);
        setErrors({ general: error.message });
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.categorie) {
      const selectedCat = categories.find(c => c.name === formData.categorie);
      setServices(selectedCat?.services || []);
      if (formData.service && !selectedCat?.services?.some(s => s.name === formData.service)) {
        setFormData(prev => ({ ...prev, service: '' }));
      }
    }
  }, [formData.categorie, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const processFile = (file, callback) => {
      const reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(file);
      return file;
    };

    switch (name) {
      case 'profileImage':
        const profileFile = files[0];
        setFormData(prev => ({ ...prev, profileImage: profileFile }));
        processFile(profileFile, setPreviewImage);
        break;

      case 'cin':
        const cinFile = files[0];
        setFormData(prev => ({ ...prev, cin: cinFile }));
        processFile(cinFile, setCinPreview);
        break;

      case 'diplomas':
        const newDiplomas = Array.from(files).slice(0, 3 - formData.diplomas.length);
        setFormData(prev => ({
          ...prev,
          diplomas: [...prev.diplomas, ...newDiplomas]
        }));
        
        newDiplomas.forEach(file => {
          processFile(file, (result) => {
            setDiplomaPreviews(prev => [...prev, {
              name: file.name,
              url: result
            }]);
          });
        });
        break;

      case 'images':
        const newImages = Array.from(files).slice(0, 4 - formData.images.length);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
        
        newImages.forEach(file => {
          processFile(file, (result) => {
            setImagePreviews(prev => [...prev, result]);
          });
        });
        break;
    }
  };

  const removeFile = (type, index) => {
    switch (type) {
      case 'profileImage':
        setFormData(prev => ({ ...prev, profileImage: null }));
        setPreviewImage(null);
        break;
        
      case 'cin':
        setFormData(prev => ({ ...prev, cin: null }));
        setCinPreview(null);
        break;
        
      case 'diploma':
        setFormData(prev => ({ 
          ...prev, 
          diplomas: prev.diplomas.filter((_, i) => i !== index) 
        }));
        setDiplomaPreviews(prev => prev.filter((_, i) => i !== index));
        break;
        
      case 'image':
        setFormData(prev => ({ 
          ...prev, 
          images: prev.images.filter((_, i) => i !== index) 
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const requiredFields = {
      name: 'Nom complet est requis',
      email: 'Email est requis',
      phone: 'Téléphone est requis',
      ville: 'Ville est requise',
      zone: 'Zone/Quartier est requis',
      password: 'Mot de passe est requis',
      terms_accepted: 'Vous devez accepter les termes et conditions'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.toString().trim() && field !== 'terms_accepted') {
        newErrors[field] = message;
      }
      if (field === 'terms_accepted' && !formData[field]) {
        newErrors[field] = message;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (role === 'artisan') {
      const requiredArtisanFields = {
        categorie: 'Catégorie est requise',
        service: 'Service est requis',
        cin: 'La CIN est obligatoire',
        annees_experience: 'Les années d\'expérience sont requises',
        terms_accepted: 'Vous devez accepter les termes et conditions'
      };

      Object.entries(requiredArtisanFields).forEach(([field, message]) => {
        if (!formData[field] && formData[field] !== 0) {
          newErrors[field] = message;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validation
    if (role === 'artisan') {
        if (etapeArtisan === 1 && !validateStep1()) {
            setIsSubmitting(false);
            return;
        }
        if (etapeArtisan === 2 && !validateStep2()) {
            setIsSubmitting(false);
            return;
        }
    } else if (!validateStep1()) {
        setIsSubmitting(false);
        return;
    }

    try {
        const formDataToSend = new FormData();
        
        // Ajout des champs de base
        const baseFields = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            ville: formData.ville,
            zone: formData.zone,
            role: role,
            terms_accepted: formData.terms_accepted // Envoi direct du boolean
        };

        Object.entries(baseFields).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Ajout de l'image de profil
        if (formData.profileImage) {
            formDataToSend.append('profile_image', formData.profileImage);
        }

        // Ajout des champs spécifiques aux artisans
        if (role === 'artisan') {
            const artisanFields = {
                description: formData.description,
                categorie: formData.categorie,
                service: formData.service,
                annees_experience: formData.annees_experience,
                societe: formData.societe
            };

            Object.entries(artisanFields).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Ajout des fichiers
            if (formData.cin) {
                formDataToSend.append('cin', formData.cin);
            }

            formData.diplomas.forEach((diploma) => {
    formDataToSend.append('diplomes[]', diploma);
});

            formData.images.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image);
            });
        }

        // Envoi de la requête
        const response = await authService.register(formDataToSend);
        
        if (response.success) {
            localStorage.setItem('token', response.token);
            
            // Redirection en fonction du statut
            if (response.statut === 'en_attente') {
                navigate('/pending-verification');
            } else {
                navigate(response.redirect_to);
            }
        } else {
            setErrors({
                general: response.message || 'Erreur lors de l\'inscription',
                ...response.errors
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        setErrors({
            general: error.message || 'Une erreur est survenue lors de l\'inscription'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextStep = () => validateStep1() && setEtapeArtisan(2);
  const prevStep = () => setEtapeArtisan(1);

  const selectedVille = villes.find(v => v.name === formData.ville);
  const zonesOptions = selectedVille?.zones?.map(z => ({ 
    value: z.name, 
    label: z.name 
  })) || [];

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
                  <>
                    {/* Étape 1 - Champs communs */}
                    <div className="flex flex-col items-center mb-4 relative">
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
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                      
                      {previewImage && (
                        <button
                          type="button"
                          onClick={() => removeFile('profileImage')}
                          className="absolute top-0 right-[8.3rem] bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <InputField
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nom complet"
                      error={errors.name}
                      required
                    />

                    <InputField
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Adresse email"
                      error={errors.email}
                      required
                    />

                    <InputField
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      error={errors.phone}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        type="select"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        placeholder="Ville"
                        options={villes.map(v => ({ value: v.name, label: v.name }))}
                        error={errors.ville}
                        required
                      />

                      <InputField
                        type="select"
                        name="zone"
                        value={formData.zone}
                        onChange={handleChange}
                        placeholder="Zone/Quartier"
                        options={zonesOptions}
                        disabled={!formData.ville}
                        error={errors.zone}
                        required
                      />
                    </div>

                    <InputField
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mot de passe"
                      error={errors.password}
                      required
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
                      error={errors.confirmPassword}
                      required
                    />

                    {/* Termes et conditions pour tous les utilisateurs */}
                    <div className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id="terms_accepted"
                          name="terms_accepted"
                          type="checkbox"
                          checked={formData.terms_accepted}
                          onChange={handleChange}
                          className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                            errors.terms_accepted ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms_accepted" className="font-medium text-gray-700">
                          J'accepte les <a href="/terms" className="text-blue-600 hover:underline">termes et conditions</a> *
                        </label>
                        {errors.terms_accepted && (
                          <p className="mt-1 text-sm text-red-600">{errors.terms_accepted}</p>
                        )}
                      </div>
                    </div>

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
                  </>
                )}

                {role === 'artisan' && etapeArtisan === 2 && (
                  <>
                    {/* Étape 2 - Champs artisans */}
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        type="select"
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        placeholder="Catégorie"
                        options={categories.map(c => ({ value: c.name, label: c.name }))}
                        error={errors.categorie}
                        required
                      />

                      <InputField
                        type="select"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        placeholder="Service"
                        options={services.map(s => ({ value: s.name, label: s.name }))}
                        disabled={!formData.categorie}
                        error={errors.service}
                        required
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

                    {/* Carte d'identité */}
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Carte d'identité nationale (CIN) *
                      </label>
                      <div className="flex items-center gap-4">
                        {cinPreview ? (
                          <div className="relative">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                              <DocumentTextIcon className="h-12 w-12 text-blue-500" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('cin')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500 text-center px-1">Ajouter CIN</span>
                            </div>
                            <input
                              type="file"
                              name="cin"
                              onChange={handleFileChange}
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              required
                            />
                          </label>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Formats acceptés:</span> JPG, PNG, PDF (max 2MB)
                          </p>
                          {errors.cin && (
                            <p className="mt-1 text-sm text-red-600">{errors.cin}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Diplômes */}
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Diplômes ou certificats (optionnel)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {diplomaPreviews.map((diploma, index) => (
                          <div key={index} className="relative">
                            <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden">
                              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                              <span className="text-xs text-gray-600 truncate px-1 absolute bottom-1">
                                {diploma.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('diploma', index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.diplomas.length < 3 && (
                          <label className="cursor-pointer">
                            <div className="w-full h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center">
                              <DocumentTextIcon className="h-6 w-6 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">Ajouter diplôme</span>
                              <span className="text-xs text-gray-400">{formData.diplomas.length}/3</span>
                            </div>
                            <input
                              type="file"
                              name="diplomas"
                              onChange={handleFileChange}
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              multiple
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Années d'expérience */}
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Années d'expérience *
                      </label>
                      <select
                        name="annees_experience"
                        value={formData.annees_experience}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                          errors.annees_experience ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="0">0-1 an</option>
                        <option value="2">2-5 ans</option>
                        <option value="6">6-10 ans</option>
                        <option value="11">Plus de 10 ans</option>
                      </select>
                      {errors.annees_experience && (
                        <p className="mt-1 text-sm text-red-600">{errors.annees_experience}</p>
                      )}
                    </div>

                    {/* Images de réalisations */}
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Images de réalisations (max 4, optionnel)
                      </label>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile('image', index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.images.length < 4 && (
                          <label className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
                            <div className="text-center p-4">
                              <PhotoIcon className="h-10 w-10 mx-auto text-gray-400" />
                              <span className="text-gray-500">Ajouter une image</span>
                              <span className="block text-xs text-gray-400">{formData.images.length}/4</span>
                            </div>
                            <input
                              type="file"
                              name="images"
                              onChange={handleFileChange}
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <InputField
                      type="text"
                      name="societe"
                      value={formData.societe}
                      onChange={handleChange}
                      placeholder="Société (optionnel)"
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
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {isSubmitting ? 'Enregistrement...' : 'Finaliser l\'inscription'}
                      </motion.button>
                    </div>
                  </>
                )}

                {role === 'client' && (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md text-lg font-medium ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
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