const fs = require('fs');

function replace(f, s, r) {
  let t = fs.readFileSync(f, 'utf8');
  let nt = t.replace(s, r);
  if (t !== nt) {
    fs.writeFileSync(f, nt, 'utf8');
    console.log('Fixed ' + f);
  } else {
    console.log('Failed to match in ' + f);
  }
}

replace('src/pages/admin/AdminAnalyticsPage.tsx', `import React, { useState } from 'react';`, `import { useState } from 'react';`);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `ChevronDown, Search, ArrowUpRight, BarChart3, CreditCard, PieChart as PieChartIcon`, `ChevronDown, ArrowUpRight, CreditCard`);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend`, `XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer`);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `import { Input } from '../../components/ui/input';\n`, ``);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `const { data: dashboardData, isLoading } = useQuery`, `const { data: dashboardData } = useQuery`);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `const { data: ordersData } = useQuery`, `const { } = useQuery`);
replace('src/pages/admin/AdminAnalyticsPage.tsx', `const days = getDays(dateRange);\n      // Wait`, `// const days = getDays(dateRange);\n      // Wait`);

replace('src/pages/admin/AdminAppearancePage.tsx', `import React, { useState } from 'react';`, `import { useState } from 'react';`);
replace('src/pages/admin/AdminAppearancePage.tsx', `UploadCloud, Sparkles, TrendingUp, MousePointerClick, \n  IndianRupee, Activity, CheckCircle, Clock`, `UploadCloud, Sparkles, MousePointerClick, \n  IndianRupee, CheckCircle, Clock`);

replace('src/pages/admin/AdminBlogPage.tsx', `import React, { useState } from 'react';`, `import { useState } from 'react';`);
replace('src/pages/admin/AdminBlogPage.tsx', `ThumbsUp, Share2, Sparkles, Plus, Search, Calendar, CheckCircle, \n  MoreHorizontal, Type, LayoutTemplate, Trash2, ArrowUpRight, \n  BarChart2, Globe`, `Sparkles, Plus, Search, Calendar, CheckCircle, \n  Trash2, \n  Globe`);

replace('src/pages/admin/AdminCustomersPage.tsx', `import { Button } from '../../components/ui/button';\n`, ``);

replace('src/pages/admin/AdminDashboardPage.tsx', `totalRevenue, totalOrders, totalCustomers, productsSold,`, `totalRevenue, totalOrders, totalCustomers,`);

replace('src/pages/admin/AdminInventoryPage.tsx', `Search, Filter, Download, Plus, AlertCircle, TrendingUp, \n  Package, Boxes, DollarSign, IndianRupee, ArrowUpRight,`, `Search, Download, Plus, AlertCircle, \n  Package, IndianRupee, ArrowUpRight,`);

replace('src/layouts/AdminLayout.tsx', `LayoutDashboard, Users, Wrench, FileText, \n  CreditCard, MessageCircle, BarChart3, Settings, LogOut, ShieldAlert,\n  Search, Bell, Menu, Package, Grid, ShoppingBag, MessageSquare, Tag,\n  Image as ImageIcon, Edit3, UserCheck, Sliders, Sun, Moon,\n  TrendingUp, ClipboardList, ArrowLeft`, `LayoutDashboard, Users, \n  Settings, LogOut, ShieldAlert,\n  Search, Bell, Menu, Package, Grid, ShoppingBag, \n  Sun, Moon,\n  ArrowLeft`);
replace('src/layouts/AdminLayout.tsx', `import { toast } from 'sonner';\n`, ``);
