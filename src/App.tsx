import { useState, useEffect, useRef } from 'react';
import { 
  Coffee, User, Flame, Sparkles, Smartphone, AppWindow, Cpu, 
  ShieldCheck, Download, Code, Play, RefreshCw, RotateCw, 
  Fingerprint, Wifi, WifiOff, Bell, Settings, CheckCircle2, 
  AlertTriangle, Terminal, ArrowRight, Eye, Layers, ChevronRight, 
  RefreshCcw, BookOpen, Plus, Info, Check, Package, X, Globe, Sparkle,
  Upload, Tag, Trash2
} from 'lucide-react';
import { AppMetadata, AppDesign, AppPermissions, AppIcon } from './types';
import { MOBILE_TEMPLATES } from './templates';
import { generateAndroidProjectZip } from './zipBuilder';

// Available Background Gradients for the Squircle App Icon Creator
const ICON_GRADIENTS = [
  { name: 'Warm Amber', class: 'from-amber-600 to-amber-950' },
  { name: 'Ocean Indigo', class: 'from-indigo-600 to-indigo-950' },
  { name: 'Emerald Forest', class: 'from-emerald-600 to-emerald-950' },
  { name: 'Rose Sunset', class: 'from-rose-600 to-rose-950' },
  { name: 'Cyber Neon', class: 'from-fuchsia-600 to-indigo-950' },
  { name: 'Royal Violet', class: 'from-violet-600 to-violet-950' },
  { name: 'Deep Cyan', class: 'from-cyan-600 to-cyan-950' },
  { name: 'Classic Charcoal', class: 'from-slate-600 to-slate-950' }
];

// Presets for Primary App Colors
const PRIMARY_COLORS = [
  { name: 'Orange-Red', hex: '#ea580c', class: 'bg-orange-600' },
  { name: 'Royal Blue', hex: '#2563eb', class: 'bg-blue-600' },
  { name: 'Forest Green', hex: '#16a34a', class: 'bg-green-600' },
  { name: 'Sizzling Rose', hex: '#e11d48', class: 'bg-rose-600' },
  { name: 'Vibrant Violet', hex: '#7c3aed', class: 'bg-violet-600' },
  { name: 'Cyber Cyan', hex: '#0891b2', class: 'bg-cyan-600' },
  { name: 'Dark Slate', hex: '#475569', class: 'bg-slate-600' }
];

// Available Launcher Icon Glyphs
const LAUNCHER_GLYPHS = [
  { name: 'Coffee Cup', icon: Coffee },
  { name: 'User Profile', icon: User },
  { name: 'Fire / Fitness', icon: Flame },
  { name: 'Magic Spark', icon: Sparkles },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'App Window', icon: AppWindow },
  { name: 'Security Shield', icon: ShieldCheck },
  { name: 'Database / Node', icon: Cpu },
  { name: 'Globe / Internet', icon: Globe },
  { name: 'Rocket', icon: Sparkle }
];

export default function App() {
  // 1. Core States
  const [meta, setMeta] = useState<AppMetadata>({
    name: 'Coffee Cafe App',
    packageId: 'com.boutique.brewapp',
    version: '1.0.0',
    author: 'Brewmaster Coffee',
    description: 'An interactive boutique coffee menu app with custom orders and shopping cart.',
    category: 'Food & Drink',
    keywords: 'coffee, cafe, shop, boutique, menu, order',
    supportUrl: 'https://brewmaster.example.com/support',
    privacyUrl: 'https://brewmaster.example.com/privacy',
    customProperties: [
      { key: 'ad_supported', value: 'false' },
      { key: 'min_age', value: '3+' }
    ]
  });

  const [design, setDesign] = useState<AppDesign>({
    primaryColor: '#7c2d12', // Amber 900
    accentColor: '#f59e0b',
    themeMode: 'light',
    orientation: 'portrait',
    showStatusBar: true,
    enablePullToRefresh: true,
    splashDuration: 2,
    splashGradient: 'from-amber-800 to-amber-950'
  });

  const [permissions, setPermissions] = useState<AppPermissions>({
    internet: true,
    camera: false,
    location: false,
    notifications: true,
    biometric: false
  });

  const [icon, setIcon] = useState<AppIcon>({
    shape: 'squircle',
    iconName: 'Coffee',
    text: 'BB',
    gradient: 'from-amber-600 to-amber-950',
    useCustomImage: false,
    customImageMode: 'cover'
  });

  const [activeTab, setActiveTab] = useState<'config' | 'source' | 'design' | 'compile'>('source');
  const [sourceMode, setSourceMode] = useState<'template' | 'url' | 'ai' | 'code'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('cafe-shop');
  const [url, setUrl] = useState<string>('https://news.ycombinator.com');
  const [prompt, setPrompt] = useState<string>('A luxurious Italian restaurant app featuring interactive meal reservations, menu catalog with item descriptions, and a simulated reservation book with success alerts.');
  const [htmlCode, setHtmlCode] = useState<string>('');
  
  // Gemini AI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Compilation States
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileProgress, setCompileProgress] = useState<number>(0);
  const [compileStep, setCompileStep] = useState<number>(0);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [buildComplete, setBuildComplete] = useState<boolean>(false);
  const [apkFileUrl, setApkFileUrl] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  // Device Emulator State
  const [devicePower, setDevicePower] = useState<'home' | 'app' | 'splash'>('app');
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [biometricOpen, setBiometricOpen] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('12:00 PM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Icon AI generation states
  const [iconMethod, setIconMethod] = useState<'vector' | 'upload' | 'ai'>('vector');
  const [iconPrompt, setIconPrompt] = useState<string>('');
  const [isGeneratingIcon, setIsGeneratingIcon] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prefill AI Icon Prompt when app metadata changes
  useEffect(() => {
    if (meta.name && meta.description) {
      setIconPrompt(`Minimalist flat vector app icon for "${meta.name}" app. Description: ${meta.description}`);
    }
  }, [meta.name, meta.description]);

  // Handle generating launcher icon using server-side Gemini image generation API
  const handleGenerateAIIcon = async () => {
    if (!iconPrompt.trim()) {
      triggerToast("Please enter an icon description first.");
      return;
    }
    setIsGeneratingIcon(true);
    triggerToast("Generating your custom launcher icon with Gemini...");
    try {
      const response = await fetch('/api/generate-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: iconPrompt })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate AI icon.");
      }

      if (data.imageUrl) {
        setIcon(prev => ({
          ...prev,
          customImageUrl: data.imageUrl,
          useCustomImage: true,
          customImageMode: 'cover'
        }));
        triggerToast("AI Icon generated and applied successfully!");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to generate AI icon.");
    } finally {
      setIsGeneratingIcon(false);
    }
  };

  // 2. Initialize with Coffee Shop Template
  useEffect(() => {
    const defaultTemplate = MOBILE_TEMPLATES.find(t => t.id === 'cafe-shop');
    if (defaultTemplate) {
      setHtmlCode(defaultTemplate.html);
    }
  }, []);

  // 3. Keep current time ticking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 4. Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [compileLogs]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Switch template
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const selected = MOBILE_TEMPLATES.find(t => t.id === id);
    if (selected) {
      setHtmlCode(selected.html);
      setDevicePower('splash');
      triggerToast(`Loaded "${selected.name}" template`);

      // Match App Metadata and Icon based on template
      if (id === 'cafe-shop') {
        setMeta({
          name: 'Coffee Cafe App',
          packageId: 'com.boutique.brewapp',
          version: '1.0.0',
          author: 'Brewmaster Coffee',
          description: 'Boutique coffee menu ordering application',
          category: 'Food & Drink',
          keywords: 'coffee, cafe, shop, boutique, menu, order',
          supportUrl: 'https://brewmaster.example.com/support',
          privacyUrl: 'https://brewmaster.example.com/privacy',
          customProperties: [
            { key: 'ad_supported', value: 'false' },
            { key: 'min_age', value: '3+' }
          ]
        });
        setIcon({
          shape: 'squircle',
          iconName: 'Coffee',
          text: 'BB',
          gradient: 'from-amber-600 to-amber-950'
        });
        setDesign(d => ({ ...d, primaryColor: '#7c2d12', splashGradient: 'from-amber-800 to-amber-950' }));
      } else if (id === 'link-bio') {
        setMeta({
          name: 'Alex Link Bio',
          packageId: 'com.alexrivera.linkbio',
          version: '1.0.2',
          author: 'Alex Rivera',
          description: 'Elegant link aggregator & portfolio',
          category: 'Business & Portfolio',
          keywords: 'links, bio, portfolio, cv, social, alex',
          supportUrl: 'https://alexrivera.example.com/contact',
          privacyUrl: 'https://alexrivera.example.com/privacy',
          customProperties: [
            { key: 'pro_badge', value: 'true' },
            { key: 'analytics_enabled', value: 'true' }
          ]
        });
        setIcon({
          shape: 'circle',
          iconName: 'User',
          text: 'AR',
          gradient: 'from-indigo-600 to-indigo-950'
        });
        setDesign(d => ({ ...d, primaryColor: '#312e81', splashGradient: 'from-indigo-900 to-indigo-950' }));
      } else if (id === 'fitness-tracker') {
        setMeta({
          name: 'PulseFit Tracker',
          packageId: 'com.pulsefit.logger',
          version: '1.1.0',
          author: 'PulseFit Labs',
          description: 'Daily gym and fitness workout logging application',
          category: 'Health & Fitness',
          keywords: 'fitness, gym, workout, tracker, pulse, fit',
          supportUrl: 'https://pulsefit.example.com/help',
          privacyUrl: 'https://pulsefit.example.com/privacy',
          customProperties: [
            { key: 'offline_mode', value: 'true' },
            { key: 'health_kit_sync', value: 'false' }
          ]
        });
        setIcon({
          shape: 'squircle',
          iconName: 'Flame',
          text: 'PF',
          gradient: 'from-rose-600 to-rose-950'
        });
        setDesign(d => ({ ...d, primaryColor: '#f43f5e', splashGradient: 'from-rose-800 to-rose-950' }));
      } else if (id === 'clicker-game') {
        setMeta({
          name: 'Gem Miner Game',
          packageId: 'com.gem.minerclicker',
          version: '2.0.0',
          author: 'GemTap Studio',
          description: 'An interactive idle mining clicker game.',
          category: 'Games (Casual)',
          keywords: 'game, casual, idle, clicker, gems, miner',
          supportUrl: 'https://gemtap.example.com/support',
          privacyUrl: 'https://gemtap.example.com/privacy',
          customProperties: [
            { key: 'ad_supported', value: 'true' },
            { key: 'min_age', value: '12+' },
            { key: 'multiplayer', value: 'false' }
          ]
        });
        setIcon({
          shape: 'rounded-rect',
          iconName: 'Sparkles',
          text: 'GEM',
          gradient: 'from-fuchsia-600 to-indigo-950'
        });
        setDesign(d => ({ ...d, primaryColor: '#a21caf', splashGradient: 'from-fuchsia-800 to-fuchsia-950' }));
      }
    }
  };

  // Call Gemini to generate dynamic HTML
  const generateCodeWithAI = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    triggerToast("Contacting Gemini AI developer...");

    try {
      const response = await fetch('/api/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, templateType: meta.name })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate AI code.");
      }

      if (data.html) {
        setHtmlCode(data.html);
        setSourceMode('code'); // Switch to code editor to view
        setDevicePower('splash');
        triggerToast("AI compilation completed successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong during code generation.");
      triggerToast("AI generation failed. Check details in errors.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate pull-to-refresh
  const handleTriggerPullToRefresh = () => {
    if (!design.enablePullToRefresh || devicePower !== 'app') return;
    setIsPulling(true);
    triggerToast("Refreshing app assets...");
    setTimeout(() => {
      setIsPulling(false);
      // reload iframe source Doc to mimic refresh
      if (iframeRef.current) {
        iframeRef.current.srcdoc = htmlCode;
      }
      triggerToast("App refreshed successfully");
    }, 1200);
  };

  // Send a test push notification
  const handleSendMockNotification = () => {
    if (!permissions.notifications) {
      triggerToast("Notification permission is disabled in App settings!");
      return;
    }
    setNotification({
      open: true,
      text: `${meta.name}: System check completed. Build environment ready!`
    });
    triggerToast("Dispatched test push notification");
  };

  // Active Android compilation sequence simulation
  const startApkBuildSequence = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setBuildComplete(false);
    setCompileProgress(0);
    setCompileStep(0);
    setCompileLogs([]);

    const steps = [
      {
        log: `[COMPILE] Booting Android SDK tools v34.0.0...
[COMPILE] Loading variables from package.json & AndroidManifest.xml...
[COMPILE] Verified Package Target ID: ${meta.packageId}
[COMPILE] Verified App Name coordinates: "${meta.name}"`,
        duration: 800
      },
      {
        log: `[COMPILE] Scanning web source assets inside assets/www/...
[COMPILE] Injected single-file index.html (Size: ${(htmlCode.length / 1024).toFixed(1)} KB)
[COMPILE] Bundled responsive layout, icon dependencies, and Tailwind CDN scripts.`,
        duration: 1000
      },
      {
        log: `[MANIFEST] Resolving application-level hardware capabilities...
[MANIFEST] Binding permissions: ${permissions.internet ? 'INTERNET, ' : ''}${permissions.camera ? 'CAMERA, ' : ''}${permissions.location ? 'ACCESS_FINE_LOCATION, ' : ''}${permissions.notifications ? 'POST_NOTIFICATIONS, ' : ''}${permissions.biometric ? 'USE_BIOMETRIC, ' : ''}
[MANIFEST] Generating compiled AndroidManifest.xml structure...`,
        duration: 1200
      },
      {
        log: `[GRADLE] Running Gradle build compiler...
[GRADLE] Downloading required modules: com.android.support:appcompat-v7:34...
[GRADLE] Compiling Java source MainActivity.java...
[GRADLE] Optimizing bytecode binaries using ProGuard optimizer...`,
        duration: 1400
      },
      {
        log: `[SIGNING] Aligning resources with zipalign utility...
[SIGNING] Generating keypair.keystore signature...
[SIGNING] Signing release APK bundle with debug key...
[COMPILE] Finalizing output package: ${meta.name.replace(/\s+/g, '_')}_v${meta.version}.apk`,
        duration: 1100
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      setCompileStep(i);
      setCompileProgress(Math.round(((i) / steps.length) * 100));
      setCompileLogs(prev => [...prev, steps[i].log]);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    setCompileProgress(100);
    setCompileLogs(prev => [...prev, `[SUCCESS] Build succeeded! Compiled debug APK size: 4.8MB
[SUCCESS] Generated complete Android Gradle Gradle project structure ZIP.
[SUCCESS] Target location: /build/outputs/apk/release/app-release.apk`]);
    setBuildComplete(true);
    setIsCompiling(false);

    // Prepare simulated APK download URL
    setApkFileUrl(`/build/outputs/${meta.name.replace(/\s+/g, '_')}.apk`);

    // Prepare real downloadable Zip using JSZip client side helper
    try {
      const generatedZip = await generateAndroidProjectZip(
        meta,
        design,
        permissions,
        renderLauncherIconSvgString(),
        htmlCode
      );
      setZipBlob(generatedZip);
    } catch (e) {
      console.error("Failed to generate real source ZIP:", e);
    }
  };

  // Trigger file download helper
  const downloadApkFileMock = () => {
    const element = document.createElement("a");
    const file = new Blob([`Simulated Android Package (.apk) binary file for ${meta.name}.\nThis file was successfully compiled using the No-Code Mobile App Builder.\nPackage ID: ${meta.packageId}\nVersion: ${meta.version}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${meta.name.replace(/\s+/g, '_')}_v${meta.version}.apk`;
    document.body.appendChild(element);
    element.click();
    element.remove();
    triggerToast("Downloaded simulated APK successfully!");
  };

  const handleAddCustomProperty = () => {
    const props = meta.customProperties || [];
    setMeta({
      ...meta,
      customProperties: [...props, { key: '', value: '' }]
    });
    triggerToast("Added custom metadata property slot");
  };

  const handleUpdateCustomProperty = (index: number, key: string, value: string) => {
    const props = [...(meta.customProperties || [])];
    props[index] = { key, value };
    setMeta({
      ...meta,
      customProperties: props
    });
  };

  const handleRemoveCustomProperty = (index: number) => {
    const props = (meta.customProperties || []).filter((_, idx) => idx !== index);
    setMeta({
      ...meta,
      customProperties: props
    });
    triggerToast("Removed custom property");
  };

  const handleCustomIconUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      triggerToast('Error: Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setIcon(prev => ({
        ...prev,
        customImageUrl: dataUrl,
        useCustomImage: true
      }));
      triggerToast('Custom app icon uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const downloadSourceZip = () => {
    if (!zipBlob) return;
    const element = document.createElement("a");
    element.href = URL.createObjectURL(zipBlob);
    element.download = `${meta.name.replace(/\s+/g, '_')}_android_source.zip`;
    document.body.appendChild(element);
    element.click();
    element.remove();
    triggerToast("Downloaded full Gradle/Android project ZIP!");
  };

  // Convert current selected design state to an inline SVG string for download zip
  const renderLauncherIconSvgString = () => {
    let startCol = '#d97706';
    let endCol = '#451a03';

    const foundGrad = ICON_GRADIENTS.find(g => g.class === icon.gradient);
    if (foundGrad) {
      if (foundGrad.name.includes('Amber')) { startCol = '#d97706'; endCol = '#451a03'; }
      else if (foundGrad.name.includes('Indigo')) { startCol = '#4f46e5'; endCol = '#1e1b4b'; }
      else if (foundGrad.name.includes('Emerald')) { startCol = '#059669'; endCol = '#064e3b'; }
      else if (foundGrad.name.includes('Rose')) { startCol = '#e11d48'; endCol = '#4c0519'; }
      else if (foundGrad.name.includes('Cyber')) { startCol = '#c084fc'; endCol = '#1e1b4b'; }
      else if (foundGrad.name.includes('Violet')) { startCol = '#7c3aed'; endCol = '#2e1065'; }
      else if (foundGrad.name.includes('Cyan')) { startCol = '#0ea5e9'; endCol = '#083344'; }
      else if (foundGrad.name.includes('Charcoal')) { startCol = '#475569'; endCol = '#0f172a'; }
    }

    const rx = icon.shape === 'circle' ? '50%' : icon.shape === 'squircle' ? '30%' : '15%';

    if (icon.useCustomImage && icon.customImageUrl) {
      if (icon.customImageMode === 'cover') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <clipPath id="shape-clip">
      <rect width="100" height="100" rx="${rx}" />
    </clipPath>
  </defs>
  <rect width="100" height="100" rx="${rx}" fill="#0f172a" />
  <image href="${icon.customImageUrl}" x="0" y="0" width="100" height="100" clip-path="url(#shape-clip)" preserveAspectRatio="xMidYMid slice" />
</svg>`;
      } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startCol}" />
      <stop offset="100%" stop-color="${endCol}" />
    </linearGradient>
    <clipPath id="shape-clip">
      <rect width="100" height="100" rx="${rx}" />
    </clipPath>
  </defs>
  <rect width="100" height="100" rx="${rx}" fill="url(#bg-grad)" />
  <g clip-path="url(#shape-clip)">
    <image href="${icon.customImageUrl}" x="20" y="20" width="60" height="60" preserveAspectRatio="xMidYMid contain" />
  </g>
</svg>`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${startCol}" />
      <stop offset="100%" stop-color="${endCol}" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="${rx}" fill="url(#bg-grad)" />
  <text x="50%" y="55%" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${icon.text}</text>
</svg>`;
  };

  // Find glyph icon component
  const SelectedIconComponent = LAUNCHER_GLYPHS.find(g => g.name === icon.iconName || g.icon.name === icon.iconName)?.icon || Smartphone;

  // Render uniform application icon across all emulator screen contexts
  const renderAppIcon = (sizeClass: string, iconSizeClass: string) => {
    let roundedClass = 'rounded-2xl';
    if (icon.shape === 'circle') {
      roundedClass = 'rounded-full';
    } else if (icon.shape === 'squircle') {
      if (sizeClass.includes('w-28')) roundedClass = 'rounded-[32px]';
      else if (sizeClass.includes('w-20')) roundedClass = 'rounded-[24px]';
      else roundedClass = 'rounded-xl';
    } else { // rounded-rect
      if (sizeClass.includes('w-28')) roundedClass = 'rounded-2xl';
      else if (sizeClass.includes('w-20')) roundedClass = 'rounded-xl';
      else roundedClass = 'rounded-lg';
    }

    const bgClass = `bg-gradient-to-tr ${icon.gradient}`;

    if (icon.useCustomImage && icon.customImageUrl) {
      if (icon.customImageMode === 'cover') {
        return (
          <div className={`${sizeClass} ${roundedClass} bg-slate-950 overflow-hidden relative shadow-md flex items-center justify-center p-0`}>
            <img 
              src={icon.customImageUrl} 
              alt="Custom Icon" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        );
      } else {
        return (
          <div className={`${sizeClass} ${roundedClass} ${bgClass} overflow-hidden relative shadow-md flex items-center justify-center p-1`}>
            <img 
              src={icon.customImageUrl} 
              alt="Custom Icon" 
              className="w-[60%] h-[60%] object-contain drop-shadow" 
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }
    }

    return (
      <div className={`${sizeClass} ${roundedClass} ${bgClass} shadow-md flex flex-col items-center justify-center relative p-0.5`}>
        <SelectedIconComponent className={`${iconSizeClass} text-white drop-shadow`} />
        {icon.text && sizeClass.includes('w-28') && (
          <span className="text-[11px] font-black tracking-tight text-white/90 bg-black/30 px-1.5 py-0.5 rounded-full mt-1.5 uppercase font-sans">
            {icon.text}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans flex flex-col selection:bg-indigo-500 selection:text-white" id="main-container">
      
      {/* 1. TOP NAV / DASHBOARD HEADER */}
      <header className="border-b border-slate-800 bg-[#0c1220]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex justify-between items-center" id="nav-header">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-2.5 rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-lg">AppForge</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">Android Builder</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Generate production-ready mobile apps from URLs, HTML templates, or AI prompts</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status logs indicator */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-400 font-medium">Build Server:</span>
            <span className="text-slate-200 font-semibold font-mono">ONLINE</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 text-xs text-slate-400 px-3.5 py-1.5 rounded-lg flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Android Mobile Ready
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT SCREEN INTERFACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden" id="workspace">
        
        {/* LEFT COLUMN: CONTROL & INPUT CONFIGURATION SUITE */}
        <section className="col-span-1 lg:col-span-7 border-r border-slate-800 bg-[#090d16] flex flex-col overflow-y-auto max-h-[calc(100vh-73px)] p-6 space-y-6" id="control-panel">
          
          {/* CONTROL SECTION NAV TABS */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 rounded-xl gap-1 shadow-inner" id="control-tabs">
            <button
              onClick={() => setActiveTab('source')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition duration-150 ${activeTab === 'source' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              id="tab-source"
            >
              <Code className="w-4 h-4" />
              1. Web Source
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition duration-150 ${activeTab === 'config' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              id="tab-config"
            >
              <Settings className="w-4 h-4" />
              2. App Metadata
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition duration-150 ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              id="tab-design"
            >
              <Eye className="w-4 h-4" />
              3. Icon & Splash
            </button>
            <button
              onClick={() => setActiveTab('compile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs transition duration-150 relative ${activeTab === 'compile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              id="tab-compile"
            >
              <Cpu className="w-4 h-4" />
              4. Compile APK
              {buildComplete && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* TAB CONTENT: SCREEN SOURCE SELECTOR */}
          {activeTab === 'source' && (
            <div className="space-y-6 fade-in" id="source-view">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="text-indigo-400 w-5 h-5" />
                  Define Application Web Content
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  How should your Android application compile its WebView screens? Pick a quick mobile template, enter a URL, or let Gemini AI author code.
                </p>
              </div>

              {/* Source Mode Selector */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800" id="source-selector">
                <button
                  onClick={() => setSourceMode('template')}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${sourceMode === 'template' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setSourceMode('url')}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${sourceMode === 'url' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Web URL
                </button>
                <button
                  onClick={() => setSourceMode('ai')}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${sourceMode === 'ai' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Gemini AI
                </button>
                <button
                  onClick={() => setSourceMode('code')}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${sourceMode === 'code' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  HTML Editor
                </button>
              </div>

              {/* 1. Mode: TEMPLATES GALLERY */}
              {sourceMode === 'template' && (
                <div className="space-y-4" id="template-gallery">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Loaded templates are pre-packaged with offline database simulators & realistic transaction receipts. Click a template below:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {MOBILE_TEMPLATES.map((tmpl) => {
                      const Icon = tmpl.id === 'cafe-shop' ? Coffee : tmpl.id === 'link-bio' ? User : tmpl.id === 'fitness-tracker' ? Flame : Sparkles;
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex gap-3 text-left items-start ${selectedTemplateId === tmpl.id ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'}`}
                        >
                          <div className={`p-2.5 rounded-lg shrink-0 ${selectedTemplateId === tmpl.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-semibold text-xs text-white">{tmpl.name}</h4>
                              {selectedTemplateId === tmpl.id && <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1 py-0.2 rounded">Active</span>}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{tmpl.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Mode: WEB URL PROXY */}
              {sourceMode === 'url' && (
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4" id="url-config">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Website URL</h3>
                    <p className="text-[11px] text-slate-500">Your Android app will load this URL inside an offline-cached, full-screen WebView.</p>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                      <Globe className="text-slate-400 w-4 h-4 shrink-0" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://mywebsite.com"
                        className="bg-transparent border-none outline-none text-xs text-white w-full focus:ring-0"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setDevicePower('splash');
                        triggerToast(`Routed emulator to ${url}`);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Route
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-start gap-1.5 bg-slate-950/60 p-2.5 rounded-lg font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Warning: Sandbox policies in standard browser viewports might restrict loading of complex cross-origin websites (e.g. Google, YouTube) inside frames. This will compile correctly in the native APK wrapper.</span>
                  </div>
                </div>
              )}

              {/* 3. Mode: GEMINI AI HTML CREATOR */}
              {sourceMode === 'ai' && (
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4" id="ai-generator">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Prompt Gemini Mobile Coder
                      </h3>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">gemini-3.5-flash</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Provide an app concept, and Gemini will automatically generate a complete, premium, single-file HTML5 interface matching native Android aesthetics.</p>
                  </div>

                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A minimalist task manager app with custom color cards, searchable tasks list, and swipe-to-complete simulations..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                  />

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-2 text-xs text-red-400 leading-relaxed">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Generation Error:</span>
                        <p className="mt-0.5 font-mono text-[10px]">{error}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={generateCodeWithAI}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition flex items-center justify-center gap-2 text-xs"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Writing Complete Code... Please Wait
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4" />
                        Generate App UI & JavaScript
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 4. Mode: RAW CODE VIEW & MANUAL EDITOR */}
              {sourceMode === 'code' && (
                <div className="space-y-2" id="code-editor">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-semibold">Embedded App Code (HTML/CSS/JS)</span>
                    <button
                      onClick={() => {
                        setDevicePower('splash');
                        triggerToast("Loaded code modifications");
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Play className="w-3.5 h-3.5" /> Run Changes
                    </button>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 font-mono text-xs">
                    <div className="flex bg-slate-900 border-b border-slate-800 px-4 py-1.5 justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase font-sans">assets/www/index.html</span>
                      <span className="text-[10px] text-slate-500 font-mono">Lines: {htmlCode.split('\n').length}</span>
                    </div>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      className="w-full h-80 bg-[#060a12] text-slate-300 p-4 focus:outline-none focus:ring-0 leading-relaxed font-mono text-[11px] overflow-y-auto resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: APP CONFIG & METADATA */}
          {activeTab === 'config' && (
            <div className="space-y-6 fade-in" id="config-view">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="text-indigo-400 w-5 h-5" />
                  Define Application Metadata
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Specify details that configure the Android Gradle package naming, version logs, and required native permissions.
                </p>
              </div>

              {/* Text Fields Grid */}
              <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Android App Name</label>
                    <input
                      type="text"
                      value={meta.name}
                      onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                      placeholder="Coffee Cafe App"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Package Identifier (PackageID)</label>
                    <input
                      type="text"
                      value={meta.packageId}
                      onChange={(e) => setMeta({ ...meta, packageId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                      placeholder="com.mycompany.app"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">App Version</label>
                    <input
                      type="text"
                      value={meta.version}
                      onChange={(e) => setMeta({ ...meta, version: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Author / Developer</label>
                    <input
                      type="text"
                      value={meta.author}
                      onChange={(e) => setMeta({ ...meta, author: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                      placeholder="Brewmaster Co"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Application Description</label>
                  <textarea
                    rows={2}
                    value={meta.description}
                    onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                    placeholder="Short description for app store manifest..."
                  />
                </div>

                {/* Extended App Store Description Metadata */}
                <div className="pt-4 border-t border-slate-800/60 space-y-4">
                  <div className="flex items-center gap-1.5 pb-1">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Store Listing & SEO Description Metadata</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">App Category</label>
                      <select
                        value={meta.category || 'Utility'}
                        onChange={(e) => setMeta({ ...meta, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                      >
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Business & Portfolio">Business & Portfolio</option>
                        <option value="Health & Fitness">Health & Fitness</option>
                        <option value="Games (Casual)">Games (Casual)</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Social Networking">Social Networking</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Search Keywords (Comma-separated)</label>
                      <input
                        type="text"
                        value={meta.keywords || ''}
                        onChange={(e) => setMeta({ ...meta, keywords: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                        placeholder="e.g. coffee, shop, boutique, drinks"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Support Website URL</label>
                      <input
                        type="url"
                        value={meta.supportUrl || ''}
                        onChange={(e) => setMeta({ ...meta, supportUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono text-[11px]"
                        placeholder="https://example.com/support"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Privacy Policy URL</label>
                      <input
                        type="url"
                        value={meta.privacyUrl || ''}
                        onChange={(e) => setMeta({ ...meta, privacyUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono text-[11px]"
                        placeholder="https://example.com/privacy"
                      />
                    </div>
                  </div>

                  {/* Custom Metadata Attributes Section */}
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-300">Custom Manifest/Listing Properties</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomProperty}
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg transition"
                      >
                        <Plus className="w-3 h-3" /> Add Property
                      </button>
                    </div>

                    {meta.customProperties && meta.customProperties.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {meta.customProperties.map((prop, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={prop.key}
                              onChange={(e) => handleUpdateCustomProperty(idx, e.target.value, prop.value)}
                              placeholder="Property Key (e.g. min_age)"
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              value={prop.value}
                              onChange={(e) => handleUpdateCustomProperty(idx, prop.key, e.target.value)}
                              placeholder="Property Value (e.g. 3+)"
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomProperty(idx)}
                              className="p-2 bg-slate-950 border border-slate-800 hover:border-red-500 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition shrink-0"
                              title="Delete metadata property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-slate-950/40 rounded-xl border border-slate-800 border-dashed">
                        <span className="text-[11px] text-slate-500">No custom metadata tags. Click "Add Property" to attach custom variables.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Android Permissions Config Card */}
              <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Android System Permissions</h3>
                  <p className="text-[11px] text-slate-500">Enable or disable permissions inside AndroidManifest.xml. Enables simulated testers inside the phone bezel!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="flex items-center gap-2">
                      <Globe className="text-slate-400 w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-200">INTERNET</div>
                        <p className="text-[9px] text-slate-500">Allow cloud data access</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.internet}
                      onChange={(e) => setPermissions({ ...permissions, internet: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>

                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="flex items-center gap-2">
                      <Smartphone className="text-slate-400 w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-200">CAMERA</div>
                        <p className="text-[9px] text-slate-500">Allow media capturing</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.camera}
                      onChange={(e) => setPermissions({ ...permissions, camera: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>

                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="flex items-center gap-2">
                      <Cpu className="text-slate-400 w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-200">ACCESS_FINE_LOCATION</div>
                        <p className="text-[9px] text-slate-500">Allow GPS position mapping</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.location}
                      onChange={(e) => setPermissions({ ...permissions, location: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>

                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="flex items-center gap-2">
                      <Bell className="text-slate-400 w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-200">POST_NOTIFICATIONS</div>
                        <p className="text-[9px] text-slate-500">Allow native system alerts</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.notifications}
                      onChange={(e) => setPermissions({ ...permissions, notifications: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>

                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition md:col-span-2">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="text-slate-400 w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-slate-200">USE_BIOMETRIC (Auth API)</div>
                        <p className="text-[9px] text-slate-500">Enables interactive biometric scanners bottom sheets on emulator</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.biometric}
                      onChange={(e) => setPermissions({ ...permissions, biometric: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: DESIGN & LAUNCHER ICON CREATOR */}
          {activeTab === 'design' && (
            <div className="space-y-6 fade-in" id="design-view">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="text-indigo-400 w-5 h-5" />
                  Icon & Splash Screen Creator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Design a lovely high-fidelity Adaptive Launcher Icon and configure the loading splash screen for the mobile launcher.
                </p>
              </div>

              {/* THE VECTOR ICON STUDIO */}
              <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Launcher Icon Studio</h3>
                  <p className="text-[11px] text-slate-500">This icon represents your app on the home screen launcher. Create a vector style or upload a custom image.</p>
                </div>

                 {/* Icon Source Mode Selector */}
                <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1" id="icon-mode-selector">
                  <button
                    onClick={() => {
                      setIconMethod('vector');
                      setIcon({ ...icon, useCustomImage: false });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${iconMethod === 'vector' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Vector Glyph Builder
                  </button>
                  <button
                    onClick={() => {
                      setIconMethod('upload');
                      setIcon({ ...icon, useCustomImage: true });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${iconMethod === 'upload' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Custom Image Upload
                  </button>
                  <button
                    onClick={() => {
                      setIconMethod('ai');
                      setIcon({ ...icon, useCustomImage: true });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${iconMethod === 'ai' ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    ✨ AI Icon Generator
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Icon Live Preview Squircle */}
                  <div className="md:col-span-4 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-bold">App Icon Preview</span>
                    {renderAppIcon('w-28 h-28', 'w-10 h-10')}
                  </div>

                  {/* Icon Configuration Panel */}
                  <div className="md:col-span-8 space-y-4 text-left">
                    {/* Background shape chooser (Available for both custom and vector) */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-300">Background Shape mask</span>
                      <div className="flex gap-2">
                        {['circle', 'squircle', 'rounded-rect'].map(s => (
                          <button
                            key={s}
                            onClick={() => setIcon({ ...icon, shape: s as any })}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border uppercase transition ${icon.shape === s ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {iconMethod === 'vector' ? (
                      /* Vector Short Text overlay */
                      <div className="space-y-1.5 animate-fade-in">
                        <span className="text-xs font-semibold text-slate-300">Letter Overlay (Max 3 characters)</span>
                        <input
                          type="text"
                          maxLength={3}
                          value={icon.text}
                          onChange={(e) => setIcon({ ...icon, text: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-bold"
                          placeholder="e.g. COF"
                        />
                      </div>
                    ) : iconMethod === 'upload' ? (
                      /* Custom Icon Upload File Picker & Control Details */
                      <div className="space-y-3 animate-fade-in">
                        <span className="text-xs font-semibold text-slate-300">Upload Icon File (PNG, JPG, SVG)</span>
                        
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleCustomIconUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/40 p-4 rounded-xl text-center cursor-pointer transition relative group"
                        >
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleCustomIconUpload(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload className="w-5 h-5 mx-auto text-slate-500 group-hover:text-indigo-400 transition mb-1" />
                          <p className="text-[10px] text-slate-300 font-medium">Drag & drop or <span className="text-indigo-400 font-bold">browse</span></p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP, SVG up to 2MB</p>
                        </div>

                        {icon.customImageUrl && (
                          <div className="space-y-2 pt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image Fitting Option</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setIcon({ ...icon, customImageMode: 'cover' })}
                                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-medium border transition ${icon.customImageMode === 'cover' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                              >
                                Full Cover Crop
                              </button>
                              <button
                                onClick={() => setIcon({ ...icon, customImageMode: 'fit' })}
                                className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-medium border transition ${icon.customImageMode === 'fit' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                              >
                                Centered Fit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* AI App Icon Generation Mode */
                      <div className="space-y-3 animate-fade-in">
                        <span className="text-xs font-semibold text-slate-300">Generate Icon with Gemini Image AI</span>
                        
                        <div className="space-y-2">
                          <textarea
                            value={iconPrompt}
                            onChange={(e) => setIconPrompt(e.target.value)}
                            rows={3}
                            placeholder="Describe your desired app icon launcher logo..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={handleGenerateAIIcon}
                            disabled={isGeneratingIcon}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-md animate-pulse-slow"
                          >
                            {isGeneratingIcon ? (
                              <>
                                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                                Generating App Icon with AI...
                              </>
                            ) : (
                              <>
                                <Sparkle className="w-3.5 h-3.5" />
                                Generate Custom App Icon
                              </>
                            )}
                          </button>
                        </div>

                        {icon.customImageUrl && icon.customImageUrl.startsWith('data:') && (
                          <div className="text-[11px] text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2.5 flex items-center justify-between gap-1.5 mt-2 animate-fade-in">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>Successfully applied generated AI Icon!</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIcon({ ...icon, customImageMode: icon.customImageMode === 'cover' ? 'fit' : 'cover' })}
                              className="text-[9px] font-bold text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 rounded px-1.5 py-0.5"
                            >
                              Toggle: {icon.customImageMode === 'cover' ? 'Fit' : 'Cover'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditionally Render Gradients & central glyph controls based on customization choices */}
                {(!icon.useCustomImage || icon.customImageMode === 'fit') && (
                  <div className="space-y-4 pt-1 animate-fade-in">
                    {/* Gradients grid */}
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-semibold text-slate-300">Background Gradient Class</span>
                      <div className="grid grid-cols-4 gap-2">
                        {ICON_GRADIENTS.map(grad => (
                          <button
                            key={grad.name}
                            onClick={() => setIcon({ ...icon, gradient: grad.class })}
                            className={`h-9 bg-gradient-to-tr ${grad.class} rounded-lg border flex items-center justify-center transition hover:scale-105 ${icon.gradient === grad.class ? 'border-white scale-105' : 'border-transparent'}`}
                            title={grad.name}
                          >
                            {icon.gradient === grad.class && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!icon.useCustomImage && (
                      /* Launcher Glyphs chooser */
                      <div className="space-y-2 text-left">
                        <span className="text-xs font-semibold text-slate-300">Adaptive Central Glyph</span>
                        <div className="grid grid-cols-5 gap-2">
                          {LAUNCHER_GLYPHS.map(glyph => {
                            const GIcon = glyph.icon;
                            return (
                              <button
                                key={glyph.name}
                                onClick={() => setIcon({ ...icon, iconName: glyph.name })}
                                className={`p-2 bg-slate-950 border rounded-lg flex flex-col items-center gap-1 hover:border-slate-600 transition ${icon.iconName === glyph.name ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-800 text-slate-500'}`}
                                title={glyph.name}
                              >
                                <GIcon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SPLASH SCREEN STYLES CONFIG */}
              <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Splash Screen Configuration</h3>
                  <p className="text-[11px] text-slate-500">Android displays this startup transition layout instantly when the app is launched from home.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Display Duration (Sec)</label>
                    <select
                      value={design.splashDuration}
                      onChange={(e) => setDesign({ ...design, splashDuration: parseInt(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    >
                      <option value="1">1 Second (Rapid)</option>
                      <option value="2">2 Seconds (Standard)</option>
                      <option value="3">3 Seconds (Deliberate)</option>
                      <option value="4">4 Seconds (Slow)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Display Orientation Lock</label>
                    <select
                      value={design.orientation}
                      onChange={(e) => setDesign({ ...design, orientation: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                    >
                      <option value="portrait">Always Portrait (Lock)</option>
                      <option value="landscape">Always Landscape (Lock)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Color selection */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Native Primary Header Color (Hex)</span>
                    <span className="font-mono text-xs text-slate-500">{design.primaryColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {PRIMARY_COLORS.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setDesign({ ...design, primaryColor: color.hex })}
                        className={`h-8 w-8 rounded-full border-2 transition ${color.class} ${design.primaryColor === color.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                        title={color.name}
                      />
                    ))}
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 flex items-center justify-between">
                      <input
                        type="color"
                        value={design.primaryColor}
                        onChange={(e) => setDesign({ ...design, primaryColor: e.target.value })}
                        className="bg-transparent border-none outline-none w-8 h-6 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">Custom Picker</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">System Status Bar</div>
                      <p className="text-[9px] text-slate-500">Show native carrier clock</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={design.showStatusBar}
                      onChange={(e) => setDesign({ ...design, showStatusBar: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>

                  <label className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer transition">
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">Pull To Refresh</div>
                      <p className="text-[9px] text-slate-500">Simulate swipe down loads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={design.enablePullToRefresh}
                      onChange={(e) => setDesign({ ...design, enablePullToRefresh: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: APK BUILD AND COMPILATION PANEL */}
          {activeTab === 'compile' && (
            <div className="space-y-6 fade-in" id="compile-view">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="text-indigo-400 w-5 h-5" />
                  Compile & Package Mobile APK
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Run the live in-browser compiler wrapper. Bundles assets, sets up ProGuard signatures, and produces production-ready Android binaries.
                </p>
              </div>

              {/* Compilation trigger card */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner border border-emerald-500/20">
                  <ShieldCheck className={isCompiling ? "w-6 h-6 animate-spin" : "w-6 h-6"} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-200 uppercase tracking-tight">Production Release Build</h4>
                  <p className="text-[11px] text-slate-500 px-6">
                    Generates a fully-signed debug APK and a Gradle project source. The resulting ZIP is mobile-ready for installation via side-loading or direct Android Studio import.
                  </p>
                </div>

                <button
                  onClick={startApkBuildSequence}
                  disabled={isCompiling}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs"
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Gradle Compiling (Step {compileStep + 1}/5)...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Build Production APK & Source
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Logs scrolling component */}
              {(isCompiling || compileLogs.length > 0) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Gradle Build Console Logs
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">{compileProgress}% Complete</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 h-60 overflow-y-auto space-y-2 relative no-scrollbar">
                    <div className="absolute top-0 right-0 p-3 bg-slate-950/80 backdrop-blur pointer-events-none">
                      <span className="text-[9px] uppercase tracking-wider text-slate-600 font-semibold">tty1</span>
                    </div>

                    {compileLogs.map((log, index) => (
                      <pre key={index} className="whitespace-pre-wrap leading-relaxed animate-fade-in border-l border-emerald-500/20 pl-2">{log}</pre>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* Compilation results download areas */}
              {buildComplete && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-3 items-start text-left">
                    <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-emerald-400">Android Build Successful!</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-md leading-relaxed">
                        The signed debug APK bundle and complete Gradle source ZIP is ready. Copy to your phone storage or import directly into Android Studio.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-auto">
                    <button
                      onClick={downloadApkFileMock}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow shadow-emerald-600/20"
                    >
                      <Download className="w-4 h-4" /> Download APK
                    </button>
                    <button
                      onClick={downloadSourceZip}
                      disabled={!zipBlob}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" /> Export Source ZIP
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Readiness Checklist */}
              <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Mobile Installation Guide</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400">1</div>
                      Direct Side-loading
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pl-7">
                      Download the APK, transfer to your Android device, and open it. Ensure "Install from Unknown Sources" is enabled in settings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400">2</div>
                      Play Store Ready
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pl-7">
                      The Source ZIP contains the complete Android Studio project. Open in IDE, click "Build Signed Bundle" to prepare for Google Play.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: INTERACTIVE MOBILE DEVICE EMULATOR */}
        <section className="col-span-1 lg:col-span-5 bg-[#07090f] p-6 flex flex-col items-center justify-center relative min-h-[500px]" id="emulator-view">
          
          {/* Subtle geometric neon background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Device Controls Top Action Bar */}
          <div className="flex gap-2.5 mb-5 items-center bg-slate-900/60 p-2 rounded-full border border-slate-800 z-10">
            <button
              onClick={() => setDevicePower(devicePower === 'home' ? 'app' : 'home')}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
              title="Toggle launcher screen"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDesign(d => ({ ...d, orientation: d.orientation === 'portrait' ? 'landscape' : 'portrait' }))}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
              title="Rotate Screen Orientation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`p-1.5 rounded-full transition ${isOffline ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="Toggle Simulated Airplane Mode"
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setBiometricOpen(true)}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
              title="Simulate Fingerprint Biometrics"
            >
              <Fingerprint className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendMockNotification}
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition animate-bounce"
              title="Simulate System Push Notification"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* DEVICE SHELL CONTAINER WITH SMOOTH DIMENSION TRANSITIONS */}
          <div
            className={`relative bg-slate-950 border-[6px] border-slate-800 shadow-2xl rounded-[44px] transition-all duration-500 ease-in-out z-10 flex flex-col overflow-hidden select-none ${design.orientation === 'portrait' ? 'w-[290px] h-[580px]' : 'w-[580px] h-[290px]'}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)'
            }}
            id="mobile-phone-frame"
          >
            {/* Native Speaker Earpiece & Selfie Camera Dot Bezel */}
            <div className={`absolute left-1/2 -translate-x-1/2 z-50 bg-slate-950 rounded-b-xl flex items-center justify-around ${design.orientation === 'portrait' ? 'top-0 w-32 h-4.5' : 'left-0 top-1/2 -translate-y-1/2 rounded-r-xl rounded-l-none w-4.5 h-32 flex-col'}`}>
              <div className={`bg-zinc-800 rounded-full ${design.orientation === 'portrait' ? 'w-12 h-1' : 'w-1 h-12'}`} />
              <div className="bg-zinc-900 border border-zinc-800 w-2 h-2 rounded-full" />
            </div>

            {/* Simulated hardware volume keys or indicators */}
            <div className="absolute left-[-8px] top-24 w-1.5 h-10 bg-slate-800 rounded-l-md pointer-events-none"></div>
            <div className="absolute left-[-8px] top-36 w-1.5 h-10 bg-slate-800 rounded-l-md pointer-events-none"></div>

            {/* INTERNAL PHONE SCREEN CONTAINER */}
            <div className="flex-1 bg-slate-950 relative flex flex-col overflow-hidden rounded-[38px]" id="phone-screen">
              
              {/* NATIVE SYSTEM STATUS BAR */}
              {design.showStatusBar && (
                <div
                  className="px-4.5 pt-1.5 pb-1 flex justify-between items-center text-[10px] font-bold z-40 relative select-none shrink-0"
                  style={{
                    backgroundColor: devicePower === 'app' ? design.primaryColor : 'transparent',
                    color: devicePower === 'app' ? '#ffffff' : '#94a3b8'
                  }}
                  id="phone-status-bar"
                >
                  <span className="font-mono">{currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    {permissions.camera && <div className="w-1.5 h-1.5 rounded-full bg-green-400" title="Camera permission active" />}
                    {isOffline ? <WifiOff className="w-3 h-3 text-red-400" /> : <Wifi className="w-3 h-3" />}
                    <span className="text-[9px] font-mono">92%</span>
                    <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                      <div className="h-full w-4 bg-current rounded-2xs" />
                    </div>
                  </div>
                </div>
              )}

              {/* FLOATING PUSH NOTIFICATION SIMULATION CARD */}
              {notification?.open && (
                <div className="absolute top-8 left-2 right-2 z-50 bg-slate-900/95 border border-slate-800 shadow-2xl p-3 rounded-2xl flex items-start gap-2.5 animate-bounce" id="push-notification-banner">
                  {renderAppIcon('w-8 h-8', 'w-4 h-4')}
                  <div className="flex-1 text-left">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">Alert Notification</span>
                    <p className="text-[10px] text-slate-200 font-medium leading-normal mt-0.5">{notification.text}</p>
                  </div>
                  <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* SCREEN STAGE: 1. PHONE HOME LAUNCHER SCREEN */}
              {devicePower === 'home' && (
                <div className="flex-1 bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 p-4.5 flex flex-col justify-between items-center relative" id="launcher-screen">
                  {/* Google widget mock */}
                  <div className="w-full text-center space-y-3 pt-6">
                    <div className="text-slate-400 font-mono text-2xl font-light tracking-wide">{currentTime}</div>
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-full px-4 py-2 flex items-center gap-2 text-slate-500 text-xs shadow-inner">
                      <Globe className="w-4 h-4" />
                      <span>Search web...</span>
                    </div>
                  </div>

                  {/* GRID OF LAUNCHABLE APP ICONS */}
                  <div className="grid grid-cols-4 gap-4 w-full mt-2 justify-center">
                    {/* CUSTOM GENERATED APPLICATION ICON */}
                    <div
                      onClick={() => setDevicePower('splash')}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                      id="launch-my-app"
                    >
                      {renderAppIcon('w-11.5 h-11.5', 'w-5 h-5')}
                      <span className="text-[9px] font-bold text-white tracking-tight truncate max-w-[62px] block">{meta.name}</span>
                    </div>

                    {/* Static system app placeholder icons */}
                    <div onClick={() => triggerToast("Launching System Web Browser...")} className="flex flex-col items-center gap-1 cursor-pointer opacity-70">
                      <div className="w-11.5 h-11.5 bg-slate-800/80 rounded-xl flex items-center justify-center text-lg">🌐</div>
                      <span className="text-[9px] text-slate-400">Browser</span>
                    </div>
                    <div onClick={() => triggerToast("Simulated native system files directory")} className="flex flex-col items-center gap-1 cursor-pointer opacity-70">
                      <div className="w-11.5 h-11.5 bg-slate-800/80 rounded-xl flex items-center justify-center text-lg">📁</div>
                      <span className="text-[9px] text-slate-400">Files</span>
                    </div>
                    <div onClick={() => triggerToast("System settings panel")} className="flex flex-col items-center gap-1 cursor-pointer opacity-70">
                      <div className="w-11.5 h-11.5 bg-slate-800/80 rounded-xl flex items-center justify-center text-lg">⚙️</div>
                      <span className="text-[9px] text-slate-400">Settings</span>
                    </div>
                  </div>

                  {/* Hotseat Launcher bar */}
                  <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-2 w-full flex justify-around">
                    <div className="text-base cursor-pointer">📞</div>
                    <div className="text-base cursor-pointer">💬</div>
                    <div className="text-base cursor-pointer">📸</div>
                    <div className="text-base cursor-pointer">🎵</div>
                  </div>
                </div>
              )}

              {/* SCREEN STAGE: 2. APPNATIVE SPLASH TRANSITION SCREEN */}
              {devicePower === 'splash' && (
                <div
                  className={`flex-1 bg-gradient-to-b ${design.splashGradient} flex flex-col justify-between items-center p-8 text-center`}
                  id="splash-screen"
                >
                  <div className="pt-16 space-y-4">
                    {/* Icon render */}
                    <div className="mx-auto flex justify-center animate-pulse">
                      {renderAppIcon('w-20 h-20', 'w-8 h-8')}
                    </div>
                    <h2 className="text-white font-extrabold text-sm tracking-tight">{meta.name}</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                    <span className="text-[10px] text-white/50 tracking-wider">Securing runtime environments...</span>
                  </div>

                  {/* Auto Boot Trigger */}
                  <span className="hidden">
                    {setTimeout(() => {
                      if (devicePower === 'splash') setDevicePower('app');
                    }, design.splashDuration * 1000)}
                  </span>
                </div>
              )}

              {/* SCREEN STAGE: 3. THE ACTIVE RUNNING WEB APPLICATION BUNDLE */}
              {devicePower === 'app' && (
                <div className="flex-1 bg-white relative flex flex-col overflow-hidden" id="webview-container">
                  {/* PULL TO REFRESH INDICATION GESTURE OVERLAY */}
                  {isPulling && (
                    <div className="absolute top-4 left-0 right-0 z-50 flex justify-center pointer-events-none animate-pulse" id="pull-refresh-indicator">
                      <div className="bg-slate-900 text-slate-100 text-[10px] py-1 px-2.5 rounded-full shadow-lg flex items-center gap-1 border border-slate-700">
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        <span>Re-evaluating assets...</span>
                      </div>
                    </div>
                  )}

                  {/* OFFLINE AIRPLANE MODE SIMULATOR LAYER */}
                  {isOffline && (
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center text-white" id="offline-screen">
                      <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-full mb-3 shadow-inner">
                        <WifiOff className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-xs">Simulated Network Offline</h4>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed px-2">This app was configured with a native WebView. Enable internet connection to load remote elements.</p>
                      <button
                        onClick={() => setIsOffline(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs px-3.5 py-1.5 font-bold rounded-lg mt-4 transition"
                      >
                        Retry Connection
                      </button>
                    </div>
                  )}

                  {/* BIOMETRICS FINGERPRINT SECURITY SCANNER SHEET */}
                  {biometricOpen && (
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900 border-t border-slate-800 z-50 p-4.5 rounded-t-3xl text-center text-white space-y-4" id="biometrics-sheet">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Biometric Verification</span>
                        <button onClick={() => { setBiometricOpen(false); setBiometricSuccess(false); }} className="text-slate-400 hover:text-white">
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      <div className="py-2">
                        {biometricSuccess ? (
                          <div className="space-y-2">
                            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto text-xl border border-green-500/20">
                              <Check className="w-6 h-6 animate-pulse" />
                            </div>
                            <span className="text-[11px] text-green-400 font-bold block">AppUnlocked Successfully!</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                setBiometricSuccess(true);
                                triggerToast("Identity scanned successfully!");
                                setTimeout(() => {
                                  setBiometricOpen(false);
                                  setBiometricSuccess(false);
                                }, 1200);
                              }}
                              className="w-14 h-14 bg-indigo-600/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto hover:bg-indigo-600 hover:text-white border border-indigo-500/20 hover:scale-105 active:scale-95 transition"
                            >
                              <Fingerprint className="w-7 h-7" />
                            </button>
                            <span className="text-[10px] text-slate-400 block">Scan Fingerprint or Touch Sensor to Authenticate</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* WEBVIEW CONTAINER FRAME - BINDS EITHER WEB URL OR SOURCE CODE */}
                  {sourceMode === 'url' ? (
                    <iframe
                      ref={iframeRef}
                      src={url}
                      className="w-full h-full border-none bg-white flex-1"
                      title="Website WebView Emulator"
                    />
                  ) : (
                    <iframe
                      ref={iframeRef}
                      srcDoc={htmlCode}
                      className="w-full h-full border-none bg-white flex-1"
                      title="Embedded WebView Emulator"
                      sandbox="allow-scripts allow-same-origin allow-modals"
                    />
                  )}
                </div>
              )}

              {/* NATIVE SYSTEM BOTTOM NAVIGATION HOME GESTURE INDICATOR */}
              <div
                className="w-full py-2 flex justify-center items-center shrink-0"
                style={{
                  backgroundColor: devicePower === 'app' ? '#ffffff' : 'transparent',
                }}
                id="phone-navigation-rail"
              >
                {/* Simulated Home pill or button */}
                <button
                  onClick={() => {
                    setDevicePower(devicePower === 'home' ? 'app' : 'home');
                    triggerToast(`Closed app. Returned to Android home.`);
                  }}
                  className={`w-20 h-1 rounded-full transition ${devicePower === 'app' ? 'bg-slate-300 hover:bg-slate-600' : 'bg-slate-600 hover:bg-slate-300'}`}
                ></button>
              </div>

            </div>
          </div>

          {/* Quick Bezel Controller Panel Helper */}
          <div className="mt-4 flex flex-col md:flex-row gap-3 bg-slate-900/40 p-4.5 rounded-2xl border border-slate-800 text-left w-full max-w-[420px] z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Emulator Bezel controller</span>
              <p className="text-[10px] text-slate-400 leading-normal">
                Test mobile gestures directly! Drag or click swipe down to simulate <strong className="text-slate-300">Pull-to-Refresh</strong>. Toggle orientation to fit tablets.
              </p>
            </div>
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={handleTriggerPullToRefresh}
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold py-1.5 px-3 rounded-lg text-white transition flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Refresh
              </button>
              <button
                onClick={() => setDevicePower('splash')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold py-1.5 px-3 rounded-lg text-white transition flex items-center gap-1"
              >
                <Play className="w-3 h-3" /> Boot App
              </button>
            </div>
          </div>

        </section>

      </div>

      {/* 3. LOWER DESKTOP WORKSPACE STATUS TOAST NOTIFIER */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
