import { getCompanyJobs } from '@/lib/api/jobs';
import React from 'react';
import { Table, Button } from "@heroui/react";

// Action Icons
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
);

const RecruiterJobs = async () => {
    const companyId = 'company_abc123';
    const jobs = await getCompanyJobs(companyId) || [];

    const formatSalary = (min, max, currency) => {
        if (!min && !max) return 'Not Specified';
        const sym = currency === 'USD' || currency === 'U' ? '$' : currency;
        return `${sym}${min} - ${sym}${max}`;
    };

    const getJobTypeLabel = (type) => {
        const mapping = { 'f': 'Full-time', 'p': 'Part-time', 'c': 'Contract', 'i': 'Internship' };
        return mapping[type?.toLowerCase()] || type || 'Full-time';
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 text-neutral-200">
            <div className="mb-6 mt-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Manage Postings</h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                    Overview of live roles, screening deadlines, and active applications.
                </p>
            </div>

            {/*
        IMPORTANT: HeroUI's Table renders its own internal "slots"
        (wrapper, table, thead, th, tbody, tr, td). A plain `className`
        on <Table> only affects the outermost element, while the
        internal slots still use HeroUI's default light theme,
        which is why the table rendered with a white background.

        Use the `classNames` prop to target each slot directly.
      */}
            <Table
                aria-label="Company active job listings table"
                classNames={{
                    wrapper: "bg-[#121212] border border-neutral-800 rounded-xl",
                    table: "bg-[#121212]",
                    thead: "bg-[#1c1c1e]",
                    tbody: "bg-[#121212]",
                    tr: "bg-[#121212] border-b border-neutral-800 hover:bg-[#1a1a1a]",
                    td: "!bg-[#121212] text-neutral-300",
                    th: "bg-[#1c1c1e] text-neutral-400 border-b border-neutral-800",
                }}
            >
                <Table.ScrollContainer>
                    <Table.Content aria-label="Company active job listings table">
                        <Table.Header className="bg-[#1c1c1e] border-b border-neutral-800">
                            {/* Added isRowHeader to fix the React Aria requirement */}
                            <Table.Column isRowHeader className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-left">
                                Job Position
                            </Table.Column>
                            <Table.Column className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-left">
                                Arrangement
                            </Table.Column>
                            <Table.Column className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-left">
                                Comp Range
                            </Table.Column>
                            <Table.Column className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-left">
                                Application Deadline
                            </Table.Column>
                            <Table.Column className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-left">
                                Status
                            </Table.Column>
                            <Table.Column className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-center w-32">
                                Actions
                            </Table.Column>
                        </Table.Header>

                        <Table.Body>
                            {jobs.length === 0 ? (
                                <Table.Row className="border-none">
                                    <Table.Cell colSpan={6} className="text-center py-12 text-neutral-500 text-sm bg-transparent">
                                        No jobs posted yet.
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                jobs.map((job) => {
                                    const jobId = job._id?.$oid || job._id;

                                    return (
                                        <Table.Row key={jobId} className="border-b border-neutral-800/60 hover:bg-neutral-900/40 transition-colors">

                                            {/* Job Title */}
                                            <Table.Cell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white text-sm capitalize">{job.jobTitle}</span>
                                                    <span className="text-xs text-neutral-500 mt-0.5">{job.companyName}</span>
                                                </div>
                                            </Table.Cell>

                                            {/* Arrangement */}
                                            <Table.Cell className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm text-neutral-300 font-medium">{getJobTypeLabel(job.jobType)}</span>
                                                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                        {job.isRemote || job.location?.toLowerCase() === 'remote' ? '🌍 Remote' : `📍 ${job.location}`}
                                                    </span>
                                                </div>
                                            </Table.Cell>

                                            {/* Salary */}
                                            <Table.Cell className="px-6 py-4 text-sm text-neutral-300 font-mono">
                                                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                                            </Table.Cell>

                                            {/* Deadline */}
                                            <Table.Cell className="px-6 py-4 text-sm text-neutral-400">
                                                {job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                }) : 'None'}
                                            </Table.Cell>

                                            {/* Status */}
                                            <Table.Cell className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${job.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                                    }`}>
                                                    ● {job.status || 'inactive'}
                                                </span>
                                            </Table.Cell>

                                            {/* Actions */}
                                            <Table.Cell className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        aria-label="View video details"
                                                        className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 min-w-0"
                                                    >
                                                        <VideoIcon />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        aria-label="Edit job posting"
                                                        className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 min-w-0"
                                                    >
                                                        <EditIcon />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        aria-label="Delete job posting"
                                                        className="w-8 h-8 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 min-w-0"
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </div>
                                            </Table.Cell>

                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </div>
    );
};

export default RecruiterJobs;