import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Linking,
    SafeAreaView,
    StatusBar,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HelpSupportScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const faqSections = [
        {
            title: "Getting Started",
            items: [
                {
                    question: "How do I identify a plant?",
                    answer: "To identify a plant, go to the Camera tab and take a clear photo of the plant. Our AI will analyze the image and provide identification results within seconds."
                },
                {
                    question: "Do I need an account to use the app?",
                    answer: "No, you can use basic features without an account. However, creating an account allows you to save your identifications, access your history, and sync across devices."
                },
                {
                    question: "Is the app available offline?",
                    answer: "Basic plant identification requires an internet connection. However, you can download specific plant databases for offline use in the Settings menu."
                }
            ]
        },
        {
            title: "Plant Identification",
            items: [
                {
                    question: "How accurate is the plant identification?",
                    answer: "Our AI model is trained on millions of plant images and has an average accuracy of 94%. Accuracy may vary based on image quality, plant rarity, and growing conditions."
                },
                {
                    question: "What parts of the plant should I photograph?",
                    answer: "For best results, take clear photos of leaves, flowers, fruits, and the overall plant structure. Multiple angles help improve identification accuracy."
                },
                {
                    question: "Can I identify mushrooms and fungi?",
                    answer: "While our primary focus is on medicinal plants, we can identify many common mushrooms and fungi. However, we always recommend consulting experts before consuming any wild fungi."
                }
            ]
        },
        {
            title: "Account & Subscription",
            items: [
                {
                    question: "How do I reset my password?",
                    answer: "Go to Login screen, tap 'Forgot Password', and enter your email address. You'll receive instructions to reset your password."
                },
                {
                    question: "What are the subscription benefits?",
                    answer: "Premium subscribers get unlimited identifications, ad-free experience, offline access, detailed plant analytics, and priority support."
                },
                {
                    question: "How do I cancel my subscription?",
                    answer: "You can manage your subscription through the App Store or Google Play Store settings. Cancellation will take effect at the end of your current billing cycle."
                }
            ]
        }
    ];

    const contactMethods = [
        {
            title: "Email Support",
            description: "Get help from our support team",
            icon: "mail-outline",
            action: () => Linking.openURL('mailto:support@medbotanica.com')
        },
        {
            title: "Live Chat",
            description: "Chat with our support agents",
            icon: "chatbubble-ellipses-outline",
            action: () => console.log("Open live chat")
        },
        {
            title: "Community Forum",
            description: "Connect with other plant enthusiasts",
            icon: "people-outline",
            action: () => Linking.openURL('https://community.medbotanica.com')
        },
        {
            title: "Report a Bug",
            description: "Help us improve the app",
            icon: "bug-outline",
            action: () => navigation.navigate('ReportBug')
        }
    ];

    const resources = [
        {
            title: "Plant Care Guide",
            icon: "book-outline",
            action: () => Linking.openURL('https://medbotanica.com/plant-care')
        },
        {
            title: "Video Tutorials",
            icon: "play-circle-outline",
            action: () => Linking.openURL('https://youtube.com/medbotanica')
        },
        {
            title: "Medicinal Plant Database",
            icon: "library-outline",
            action: () => navigation.navigate('PlantDatabase')
        },
        {
            title: "Safety Guidelines",
            icon: "warning-outline",
            action: () => navigation.navigate('SafetyGuidelines')
        }
    ];

    const FAQItem = ({ question, answer, isExpanded }) => (
        <View style={styles.faqItem}>
            <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleSection(question)}
            >
                <Text style={styles.faqQuestionText}>{question}</Text>
                <Icon 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#52796F" 
                />
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{answer}</Text>
                </View>
            )}
        </View>
    );

    const ContactCard = ({ title, description, icon, action }) => (
        <TouchableOpacity style={styles.contactCard} onPress={action}>
            <View style={styles.contactIcon}>
                <Icon name={icon} size={24} color="#27AE60" />
            </View>
            <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{title}</Text>
                <Text style={styles.contactDescription}>{description}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
    );

    const ResourceCard = ({ title, icon, action }) => (
        <TouchableOpacity style={styles.resourceCard} onPress={action}>
            <Icon name={icon} size={20} color="#27AE60" />
            <Text style={styles.resourceText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-back" size={24} color="#1B4332" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#95A5A6" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Quick Help */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Help</Text>
                    <View style={styles.quickHelpGrid}>
                        <ResourceCard
                            title="Plant Care"
                            icon="leaf-outline"
                            action={() => navigation.navigate('PlantCare')}
                        />
                        <ResourceCard
                            title="Troubleshooting"
                            icon="build-outline"
                            action={() => navigation.navigate('Troubleshooting')}
                        />
                        <ResourceCard
                            title="App Guide"
                            icon="map-outline"
                            action={() => navigation.navigate('AppGuide')}
                        />
                        <ResourceCard
                            title="Subscription"
                            icon="card-outline"
                            action={() => navigation.navigate('SubscriptionHelp')}
                        />
                    </View>
                </View>

                {/* Contact Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>
                    {contactMethods.map((method, index) => (
                        <ContactCard
                            key={index}
                            title={method.title}
                            description={method.description}
                            icon={method.icon}
                            action={method.action}
                        />
                    ))}
                </View>

                {/* Frequently Asked Questions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.faqSection}>
                            <Text style={styles.faqSectionTitle}>{section.title}</Text>
                            {section.items.map((item, itemIndex) => (
                                <FAQItem
                                    key={itemIndex}
                                    question={item.question}
                                    answer={item.answer}
                                    isExpanded={expandedSections[item.question]}
                                />
                            ))}
                        </View>
                    ))}
                </View>

                {/* Additional Resources */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Resources</Text>
                    <View style={styles.resourcesGrid}>
                        {resources.map((resource, index) => (
                            <ResourceCard
                                key={index}
                                title={resource.title}
                                icon={resource.icon}
                                action={resource.action}
                            />
                        ))}
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appInfoText}>MedBotanica v1.0.0</Text>
                    <Text style={styles.appInfoSubtext}>© 2024 MedBotanica. All rights reserved.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FDF9',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1B4332',
    },
    headerRight: {
        width: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#1B4332',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 16,
    },
    quickHelpGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    resourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
        borderRadius: 12,
        padding: 16,
        gap: 8,
        flex: 1,
        minWidth: '48%',
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    resourceText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1B4332',
        flex: 1,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
    },
    contactIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactContent: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1B4332',
        marginBottom: 4,
    },
    contactDescription: {
        fontSize: 14,
        color: '#52796F',
    },
    faqSection: {
        marginBottom: 16,
    },
    faqSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 12,
    },
    faqItem: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E8F5E8',
        borderRadius: 12,
        overflow: 'hidden',
    },
    faqQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F8FDF9',
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1B4332',
        marginRight: 12,
    },
    faqAnswer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E8F5E8',
    },
    faqAnswerText: {
        fontSize: 14,
        color: '#52796F',
        lineHeight: 20,
    },
    resourcesGrid: {
        gap: 12,
    },
    appInfo: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    appInfoText: {
        fontSize: 14,
        color: '#95A5A6',
        marginBottom: 4,
    },
    appInfoSubtext: {
        fontSize: 12,
        color: '#95A5A6',
        textAlign: 'center',
    },
});

export default HelpSupportScreen;