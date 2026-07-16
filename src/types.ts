export interface AppMetadata {
  name: string;
  packageId: string;
  version: string;
  author: string;
  description: string;
}

export interface AppIcon {
  shape: 'circle' | 'squircle' | 'rounded-rect';
  iconName: string; // lucide icon name
  text: string;
  gradient: string; // css gradient class
}

export interface AppDesign {
  primaryColor: string; // hex or tailwind color
  accentColor: string;
  themeMode: 'light' | 'dark';
  orientation: 'portrait' | 'landscape';
  showStatusBar: boolean;
  enablePullToRefresh: boolean;
  splashDuration: number; // in seconds
  splashGradient: string;
}

export interface AppPermissions {
  internet: boolean;
  camera: boolean;
  location: boolean;
  notifications: boolean;
  biometric: boolean;
}

export interface MobileTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  html: string;
}
