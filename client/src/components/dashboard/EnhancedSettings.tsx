import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  MapPin,
  Users,
  Heart
} from "lucide-react";
import { UserProfileTabs } from "@/components/profile/UserProfileTabs";
import { useAuth } from "@/hooks/useAuth";

export function EnhancedSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    bookingReminders: true,
    promotions: false,
    newsletter: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showLocation: false,
    allowMessages: true,
    shareAnalytics: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/Edmonton',
    currency: 'CAD',
    theme: 'light'
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" data-testid="profile-tab">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="notifications-tab">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" data-testid="privacy-tab">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" data-testid="preferences-tab">
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="account" data-testid="account-tab">
            <CreditCard className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <UserProfileTabs />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="email-notifications">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Receive notifications via email</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="sms-notifications">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-gray-600">Receive notifications via text message</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="push-notifications">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-600">Receive browser push notifications</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="booking-reminders">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Booking Reminders</div>
                        <div className="text-sm text-gray-600">Upcoming appointment reminders</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.bookingReminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, bookingReminders: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="promotions">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Promotions & Offers</div>
                        <div className="text-sm text-gray-600">Special offers and health tips</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="newsletter">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Newsletter</div>
                        <div className="text-sm text-gray-600">Monthly health newsletter</div>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => setNotifications({...notifications, newsletter: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Profile Visibility</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="profile-visible">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Public Profile</div>
                        <div className="text-sm text-gray-600">Allow providers to see your basic profile</div>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="show-location">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Share Location</div>
                        <div className="text-sm text-gray-600">Share your general location with providers</div>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.showLocation}
                      onCheckedChange={(checked) => setPrivacy({...privacy, showLocation: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between" data-testid="allow-messages">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Direct Messages</div>
                        <div className="text-sm text-gray-600">Allow providers to message you directly</div>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Data & Analytics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="share-analytics">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Analytics Sharing</div>
                        <div className="text-sm text-gray-600">Help improve our services with anonymous usage data</div>
                      </div>
                    </div>
                    <Switch 
                      checked={privacy.shareAnalytics}
                      onCheckedChange={(checked) => setPrivacy({...privacy, shareAnalytics: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Security Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="change-password">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="two-factor-auth">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="download-data">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Regional Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      data-testid="language-select"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      data-testid="timezone-select"
                    >
                      <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                      <option value="America/Toronto">Eastern Time (Toronto)</option>
                      <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                      data-testid="currency-select"
                    >
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      data-testid="theme-select"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]" data-testid="save-preferences">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Management */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Account ID:</span>
                    <span className="text-sm font-mono">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member Since:</span>
                    <span className="text-sm">January 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Account Status:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-4 text-red-600">Danger Zone</h4>
                <div className="border border-red-200 rounded-lg p-4 space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Export Account Data</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Download a copy of all your account data including profiles, messages, and bookings.
                    </p>
                    <Button variant="outline" data-testid="export-account-data">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Delete Account</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" data-testid="delete-account">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}