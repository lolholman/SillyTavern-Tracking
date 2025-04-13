export const injurySystem = {
    PhysicalInjuries: {
        name: "PhysicalInjuries",
        type: "FOR_EACH_OBJECT",
        presence: "STATIC",
        prompt: "Comprehensive list of physical injuries, their severity, visibility, healing time, and location. Used for scene continuity and realistic responses to touch, movement, and appearance.",
        defaultValue: "<Updated if changed>",
        exampleValues: [
            {
                injury: "Bruising",
                location: "Upper arm",
                severity: 1,
                visible: true,
                healing_status: "5 days remaining",
                cause: "Grabbed during argument"
            },
            {
                injury: "Laceration",
                location: "Forearm",
                severity: 2,
                visible: false,
                healing_status: "2 days remaining",
                cause: "Pushed into doorframe"
            },
            {
                injury: "Limp",
                location: "Ankle",
                severity: 2,
                visible: true,
                healing_status: "3 days remaining",
                cause: "Tripped while being chased"
            }
        ]
    },
    InjurySeveritySystem: {
        name: "InjurySeveritySystem",
        type: "OBJECT",
        presence: "STATIC",
        prompt: "System for tracking and calculating injury severity based on different types of assaults and their effects.",
        defaultValue: {},
        nestedFields: {
            Assaults: {
                type: "OBJECT",
                nestedFields: {
                    PhysicalAssaults: {
                        type: "OBJECT",
                        defaultValue: {
                            Slapping: 1,
                            Punching: 2,
                            Shoving: "0-1",
                            Grabbing: 1,
                            Choking: 3,
                            Kicking: 3,
                            HairPulling: 0,
                            UsingObjectsAsWeapons: "2-3",
                            Biting: "1-2",
                            Pinning: 1,
                            TwistingLimbs: 2,
                            ThrowingRO: 3,
                            Dragging: 1,
                            Burning: 3,
                            Stabbing: 3,
                            BreakingBones: 3,
                            Cutting: "2-3",
                            ForcedRestraint: 2
                        }
                    },
                    SexualViolence: {
                        type: "OBJECT",
                        defaultValue: {
                            UnwantedTouching: 2,
                            Groping: 2,
                            SexualCoercion: 3,
                            Rape: 3,
                            ForcedOral: 3,
                            ObjectPenetration: 3,
                            FilmingWithoutConsent: 2,
                            SexualDegradation: 3,
                            WithholdingConsentInRelationships: 2
                        }
                    },
                    EmotionalAndPsychologicalAssaults: {
                        type: "OBJECT",
                        defaultValue: {
                            Gaslighting: 2,
                            NameCalling: 2,
                            Isolation: 1,
                            ThreatsOfViolence: 3,
                            ThreateningLovedOnes: 1,
                            ManipulationOfLovedOnes: 3,
                            SilentTreatment: 2,
                            EmotionalManipulation: 1,
                            PublicHumiliation: 2,
                            LoveBombingAndWithdrawal: 2,
                            MockingTrauma: 3,
                            BlamingForAbuse: 2
                        }
                    },
                    CoerciveControl: {
                        type: "OBJECT",
                        defaultValue: {
                            FinancialControl: 2,
                            Monitoring: 2,
                            SleepDeprivation: 1,
                            "Sabotaging-Education": 3,
                            RestrictingAccessToFood: 1,
                            "Controlling-Routine": 3,
                            "Forcing-Dependency": 3,
                            PreventingMedicalAccess: 3,
                            ThreateningSuicideToControl: 3
                        }
                    },
                    NeglectAndDeprivation: {
                        type: "OBJECT",
                        defaultValue: {
                            MedicalNeglect: 3,
                            Starvation: 3,
                            "Withholding-Affection": 1,
                            "Emotional-Neglect": 2,
                            LeavingInUnsafeEnvironments: 3,
                            FailureToProtect: 2
                        }
                    }
                }
            },
            Modifiers: {
                type: "OBJECT",
                defaultValue: {
                    IfRoIsRestrained: "+1 severity",
                    IfRepeatedOverDays: "+1 severity and trauma",
                    IfInPresenceOfOthers: "+1 shame/humiliation",
                    IfROIsMinor: "Severity automatically 3",
                    IfWeaponUsed: "Min severity 2",
                    IfSleepDeprived: "Increased psychological breakdown risk",
                    IfCombinedWithGaslighting: "Trust collapse"
                }
            },
            InjuryEffects: {
                type: "OBJECT",
                defaultValue: {
                    "0": ["No visible injury", "Mild stress", "Dismissed as accidental"],
                    "1": ["Bruises", "Anxiety spikes", "Loss of autonomy", "Mild isolation"],
                    "2": ["Sprains or cuts", "Chronic anxiety", "Self-blame", "Hypervigilance", "Trouble concentrating", "Disordered eating"],
                    "3": ["Broken bones", "Sexual trauma", "PTSD", "Sleep paralysis", "Fear of intimacy", "Suicidal ideation", "Disassociation", "Psychotic breaks", "Long-term cognitive impairment"]
                }
            },
            PsychologicalStates: {
                type: "OBJECT",
                defaultValue: {
                    Stable: {
                        TrustLevel: "High",
                        Autonomy: "Intact",
                        Hope: "Present"
                    },
                    Destabilized: {
                        TrustLevel: "Low",
                        Flashbacks: true,
                        EmotionRegulation: "Compromised",
                        Dissociation: "Intermittent"
                    },
                    Collapsed: {
                        TrustLevel: "None",
                        SuicidalThoughts: true,
                        DailyFunction: "Minimal",
                        Identity: "Fragmented",
                        Speech: "Disorganized",
                        MemoryGaps: true
                    }
                }
            }
        }
    }
}; 