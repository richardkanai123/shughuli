'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft, FolderOpen } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const CreateProjectSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />

                            </div>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold"
                        >
                            Project Created Successfully!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-muted-foreground"
                        >
                            Your new project has been created and is ready to go.
                            You can now start adding tasks and team members.
                        </motion.p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full sm:w-1/2"
                        >
                            <Button
                                variant="outline"
                                className="w-full group"
                                asChild
                            >
                                <Link href="/dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-full sm:w-1/2"
                        >
                            <Button
                                className="w-full group"
                                asChild
                            >
                                <Link href="/dashboard/projects">
                                    <FolderOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                    View Projects
                                </Link>
                            </Button>
                        </motion.div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

export default CreateProjectSuccess