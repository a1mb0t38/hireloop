"use client";

import React, { useState } from "react";
import {
    Form,
    Fieldset,
    TextField,
    Select,
    ListBox,
    Label,
    Button,
    Switch
} from "@heroui/react";
import { createJob } from "@/lib/actions/jobs";
import { toast, ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";

const JOB_CATEGORIES = [
    { id: "technology", name: "Technology" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
];

const JOB_TYPES = [
    { id: "full-time", name: "Full-time" },
    { id: "part-time", name: "Part-time" },
    { id: "contract", name: "Contract" },
    { id: "internship", name: "Internship" },
];

const CURRENCIES = [
    { id: "USD", name: "USD ($)" },
    { id: "EUR", name: "EUR (€)" },
    { id: "GBP", name: "GBP (£)" },
    { id: "BDT", name: "BDT (৳)" },
];

export default function NewJobPost() {
    const [companyInfo] = useState({
        name: "Acme Corp",
        isApproved: true,
        plan: "Free",
        activeJobsCount: 1,
        jobLimit: 3,
    });

    const [isRemote, setIsRemote] = useState(false);
    const [errors, setErrors] = useState({});

    const [selectedCategory, setSelectedCategory] = useState(new Set());
    const [selectedJobType, setSelectedJobType] = useState(new Set());
    const [selectedCurrency, setSelectedCurrency] = useState(new Set(["USD"]));

    const canPost = companyInfo.isApproved && companyInfo.activeJobsCount < companyInfo.jobLimit;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collect native input/textarea values via FormData
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Validate
        const newErrors = {};
        if (!data.jobTitle) newErrors.jobTitle = "Job title is required";
        if (selectedCategory.size === 0) newErrors.category = "Please select a category";
        if (selectedJobType.size === 0) newErrors.jobType = "Please select a job type";
        if (!isRemote && !data.location) newErrors.location = "Location is required";
        if (!data.deadline) newErrors.deadline = "Application deadline is required";
        if (!data.responsibilities) newErrors.responsibilities = "Responsibilities are required";
        if (!data.requirements) newErrors.requirements = "Requirements are required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // Merge FormData fields + React state-controlled fields (Selects, Switch)
        const finalPayload = {
            // Text inputs (from FormData)
            jobTitle: data.jobTitle,
            deadline: data.deadline,
            salaryMin: data.salaryMin || null,
            salaryMax: data.salaryMax || null,
            location: isRemote ? "Remote" : data.location,
            responsibilities: data.responsibilities,
            requirements: data.requirements,
            benefits: data.benefits || null,
            // Select / Switch state
            category: Array.from(selectedCategory)[0],
            jobType: Array.from(selectedJobType)[0],
            currency: Array.from(selectedCurrency)[0],
            isRemote,
            // Meta
            companyId: "company_abc123",
            companyName: companyInfo.name,
            status: "active",
            createdAt: new Date().toISOString(),
        };

        const res = await createJob(finalPayload);
        if(res){
            toast.success("Job Posted successfully")
            // e.currentTarget.reset();
            // setIsRemote(false)
            redirect("/dashboard/recruiter")
        }else{
            toast.error("Something went wroong")
        }
    };

    if (!canPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-[#121212] rounded-xl border border-neutral-800">
                <h2 className="text-xl font-bold text-red-400 mb-2">Posting Restricted</h2>
                {!companyInfo.isApproved ? (
                    <p className="text-neutral-400">Your company account is currently pending approval.</p>
                ) : (
                    <p className="text-neutral-400">
                        You have reached the maximum limit for your <strong>{companyInfo.plan}</strong> plan
                        ({companyInfo.activeJobsCount}/{companyInfo.jobLimit} jobs). Please upgrade to post more.
                    </p>
                )}
            </div>
        );
    }

    // Reusable component style sets
    const inputWrapperStyles = "w-full flex flex-col gap-1.5";
    const selectTriggerStyles = "flex items-center justify-between w-full min-h-10 px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 text-sm text-left text-neutral-200 outline-none transition-colors";
    const popoverStyles = "w-[var(--trigger-width)] bg-[#1c1c1e] border border-neutral-800 rounded-lg shadow-xl p-1 text-neutral-200";
    const legendStyles = "text-sm font-semibold text-neutral-400 tracking-wider uppercase mb-4";

    return (
        <div className="max-w-3xl mx-auto bg-[#121212] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden text-neutral-200 mb-10 mt-6">

            {/* Header */}
            <div className="p-6 border-b border-neutral-800">
                <h1 className="text-xl font-semibold text-white">Post a New Job</h1>
                <p className="text-xs text-neutral-400 mt-1">
                    Create an active job listing. Posting as <span className="text-white font-medium">{companyInfo.name}</span> ({companyInfo.plan} Plan).
                </p>
            </div>

            {/* FIX 1: Form wraps everything including the footer buttons */}
            <Form onSubmit={handleSubmit} className="p-6 space-y-8" validationErrors={errors}>

                {/* SECTION 1: Job Info */}
                <Fieldset>
                    <legend className={legendStyles}>Job Information</legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Job Title */}
                        <TextField isRequired name="jobTitle" className={inputWrapperStyles}>
                            <Label className="text-neutral-300 font-medium text-sm">Job Title</Label>
                            <input
                                name="jobTitle"
                                placeholder="e.g. Senior Frontend Engineer"
                                className="w-full h-10 px-3 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm outline-none transition-colors"
                            />
                        </TextField>

                        {/* Job Category */}
                        <Select
                            isRequired
                            className={inputWrapperStyles}
                            selectedKeys={selectedCategory}
                            onSelectionChange={setSelectedCategory}
                        >
                            <Label className="text-neutral-300 font-medium text-sm">Job Category</Label>
                            <Select.Trigger className={selectTriggerStyles}>
                                <Select.Value className="placeholder:text-neutral-500" placeholder="Select category" />
                                <Select.Indicator className="text-neutral-500 text-xs">▼</Select.Indicator>
                            </Select.Trigger>
                            <Select.Popover className={popoverStyles}>
                                <ListBox className="outline-none">
                                    {JOB_CATEGORIES.map((cat) => (
                                        <ListBox.Item
                                            key={cat.id}
                                            id={cat.id}
                                            textValue={cat.name}
                                            className="px-3 py-2 rounded-md text-sm hover:bg-neutral-800 cursor-pointer outline-none data-[selected=true]:bg-neutral-700"
                                        >
                                            {cat.name}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>

                        {/* Job Type */}
                        <Select
                            isRequired
                            className={inputWrapperStyles}
                            selectedKeys={selectedJobType}
                            onSelectionChange={setSelectedJobType}
                        >
                            <Label className="text-neutral-300 font-medium text-sm">Job Type</Label>
                            <Select.Trigger className={selectTriggerStyles}>
                                <Select.Value placeholder="Select job type" />
                                <Select.Indicator className="text-neutral-500 text-xs">▼</Select.Indicator>
                            </Select.Trigger>
                            <Select.Popover className={popoverStyles}>
                                <ListBox className="outline-none">
                                    {JOB_TYPES.map((type) => (
                                        <ListBox.Item
                                            key={type.id}
                                            id={type.id}
                                            textValue={type.name}
                                            className="px-3 py-2 rounded-md text-sm hover:bg-neutral-800 cursor-pointer outline-none data-[selected=true]:bg-neutral-700"
                                        >
                                            {type.name}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>

                        {/* Application Deadline */}
                        <TextField isRequired name="deadline" className={inputWrapperStyles}>
                            <Label className="text-neutral-300 font-medium text-sm">Application Deadline</Label>
                            <input
                                name="deadline"
                                type="date"
                                className="w-full h-10 px-3 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm outline-none transition-colors text-neutral-300 [color-scheme:dark]"
                            />
                        </TextField>
                    </div>

                    {/* Salary Sub-grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full items-end">
                        <TextField name="salaryMin" className={inputWrapperStyles}>
                            <Label className="text-neutral-300 font-medium text-sm">Min Salary</Label>
                            <input
                                name="salaryMin"
                                type="number"
                                placeholder="0"
                                className="w-full h-10 px-3 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm outline-none transition-colors"
                            />
                        </TextField>

                        <TextField name="salaryMax" className={inputWrapperStyles}>
                            <Label className="text-neutral-300 font-medium text-sm">Max Salary</Label>
                            <input
                                name="salaryMax"
                                type="number"
                                placeholder="0"
                                className="w-full h-10 px-3 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm outline-none transition-colors"
                            />
                        </TextField>

                        {/* Currency Select */}
                        <Select
                            className={inputWrapperStyles}
                            selectedKeys={selectedCurrency}
                            onSelectionChange={setSelectedCurrency}
                        >
                            <Label className="text-neutral-300 font-medium text-sm">Currency</Label>
                            <Select.Trigger className={selectTriggerStyles}>
                                <Select.Value />
                                <Select.Indicator className="text-neutral-500 text-xs">▼</Select.Indicator>
                            </Select.Trigger>
                            <Select.Popover className={popoverStyles}>
                                <ListBox className="outline-none">
                                    {CURRENCIES.map((cur) => (
                                        <ListBox.Item
                                            key={cur.id}
                                            id={cur.id}
                                            textValue={cur.id}
                                            className="px-3 py-2 rounded-md text-sm hover:bg-neutral-800 cursor-pointer outline-none data-[selected=true]:bg-neutral-700"
                                        >
                                            {cur.name}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>

                    {/* Location & Remote Switch */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6 w-full">
                        <div className="flex-1">
                            <TextField isRequired={!isRemote} name="location" className={inputWrapperStyles}>
                                <Label className="text-neutral-300 font-medium text-sm">Location</Label>
                                <input
                                    name="location"
                                    disabled={isRemote}
                                    placeholder={isRemote ? "Remote Position" : "e.g. San Francisco, CA"}
                                    className="w-full h-10 px-3 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                />
                            </TextField>
                        </div>
                        <div className="flex items-center gap-2 sm:pt-6">
                            <Switch
                                isSelected={isRemote}
                                onChange={setIsRemote}
                                aria-label="Toggle remote work"
                            >
                                <Switch.Control className={`w-10 h-6 rounded-full transition-colors ${isRemote ? "bg-white" : "bg-neutral-600"}`}>
                                    <Switch.Thumb className="bg-black data-[selected=true]:bg-black" />
                                </Switch.Control>
                            </Switch>
                            <span className="text-sm text-neutral-300 font-medium">This is a fully remote role</span>
                        </div>
                    </div>
                </Fieldset>

                <hr className="border-neutral-800" />

                {/* SECTION 2: Job Specifications */}
                {/* FIX 2: Removed stray </div> that was closing a non-existent <div> inside Fieldset */}
                <Fieldset>
                    <legend className={legendStyles}>Job Specifications</legend>

                    <div className="flex flex-col gap-6 w-full">
                        {/* Responsibilities */}
                        <div className={inputWrapperStyles}>
                            <label htmlFor="responsibilities" className="text-neutral-300 font-medium text-sm">
                                Responsibilities <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="responsibilities"
                                name="responsibilities"
                                required
                                rows={4}
                                placeholder="Outline core responsibilities and expectations..."
                                className="w-full px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm text-neutral-200 outline-none transition-colors resize-y min-h-[100px]"
                            />
                        </div>

                        {/* Requirements */}
                        <div className={inputWrapperStyles}>
                            <label htmlFor="requirements" className="text-neutral-300 font-medium text-sm">
                                Requirements <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                required
                                rows={4}
                                placeholder="Skills, experience level, educational background requirements..."
                                className="w-full px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm text-neutral-200 outline-none transition-colors resize-y min-h-[100px]"
                            />
                        </div>

                        {/* Benefits */}
                        <div className={inputWrapperStyles}>
                            <label htmlFor="benefits" className="text-neutral-300 font-medium text-sm">
                                Benefits
                            </label>
                            <textarea
                                id="benefits"
                                name="benefits"
                                rows={4}
                                placeholder="Perks, healthcare options, insurance, equity..."
                                className="w-full px-3 py-2 rounded-lg bg-[#1c1c1e] border border-neutral-700 hover:border-neutral-500 focus:border-white text-sm text-neutral-200 outline-none transition-colors resize-y min-h-[100px]"
                            />
                        </div>
                    </div>
                </Fieldset>

                {/* FIX 4: Footer buttons are now INSIDE the <Form> so submit works */}
                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                    <Button
                        type="button"
                        className="bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-700 px-4 h-10 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-white text-black font-semibold hover:bg-neutral-200 px-6 h-10 rounded-lg text-sm transition-colors"
                    >
                        Publish Job
                    </Button>
                </div>
            </Form>
            <ToastContainer></ToastContainer>
        </div>
    );
}