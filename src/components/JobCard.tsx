import { MapPin, Briefcase, Calendar, Star, Building2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  onSaveJob?: (jobId: string) => void;
  isSaved?: boolean;
}

export function JobCard({ job, onViewDetails, onSaveJob, isSaved }: JobCardProps) {
  const isGovernment = job.sector === 'government';
  const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={`${
                  isGovernment 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
                variant="outline"
              >
                {isGovernment ? 'Government' : 'Private'}
              </Badge>
              <Badge variant="outline">{job.category}</Badge>
              {job.featured && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200" variant="outline">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  Featured
                </Badge>
              )}
            </div>
            <h3 
              className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-1"
              onClick={() => onViewDetails(job.id)}
            >
              {job.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{job.organization}</span>
            </div>
          </div>
          
          {onSaveJob && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onSaveJob(job.id);
              }}
            >
              <Star className={`w-5 h-5 ${isSaved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
            </Button>
          )}
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{job.numberOfPosts} Post{job.numberOfPosts > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Apply by: {new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs">Qualification: {job.qualification}</span>
          </div>
        </div>

        {/* Salary & Experience */}
        <div className="flex items-center gap-4 text-sm">
          {job.salary && (
            <div className="text-green-600">
              💰 {job.salary}
            </div>
          )}
          <div className="text-gray-600">
            📊 Experience: {job.experience}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{job.views} views</span>
            <span>{job.applications} applications</span>
          </div>
          <div className="flex items-center gap-2">
            {daysLeft > 0 && daysLeft <= 7 && (
              <Badge variant="destructive" className="text-xs">
                {daysLeft} days left
              </Badge>
            )}
            <Button 
              size="sm" 
              onClick={() => onViewDetails(job.id)}
              className={isGovernment ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
