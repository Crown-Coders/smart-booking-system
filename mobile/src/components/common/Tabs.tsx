// mobile/src/components/common/Tabs.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabsProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

type TabsListProps = { children: React.ReactNode };
type TabsTriggerProps = { value: string; children: React.ReactNode };
type TabsContentProps = { value: string; children: React.ReactNode };

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  const [internalTab, setInternalTab] = useState(value || '');
  const activeTab = value !== undefined ? value : internalTab;
  const setActiveTab = (newValue: string) => {
    if (onValueChange) onValueChange(newValue);
    else setInternalTab(newValue);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children }) => (
  <View style={styles.tabList}>{children}</View>
);

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const isActive = context.activeTab === value;
  return (
    <TouchableOpacity
      style={[styles.tabTrigger, isActive && styles.activeTrigger]}
      onPress={() => context.setActiveTab(value)}
    >
      <Text style={[styles.tabText, isActive && styles.activeText]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  if (context.activeTab !== value) return null;
  return <View style={styles.tabContent}>{children}</View>;
};

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#E5DDDE',
    borderRadius: 30,
    padding: 4,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 30,
  },
  activeTrigger: {
    backgroundColor: '#002324',
  },
  tabText: {
    fontWeight: '500',
    color: '#002324',
  },
  activeText: {
    color: '#EBFACF',
  },
  tabContent: {
    marginTop: 16,
  },
});