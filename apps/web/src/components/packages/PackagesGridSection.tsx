'use client';

import React, { useState } from 'react';
import { PhotographyPackage } from '@/lib/api';
import { VisualPackageCard } from './VisualPackageCard';
import { PackageDetailModal } from './PackageDetailModal';

interface PackagesGridSectionProps {
  packages: PhotographyPackage[];
}

export function PackagesGridSection({ packages }: PackagesGridSectionProps) {
  const [selectedPkg, setSelectedPkg] = useState<PhotographyPackage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleOpenDetail = (pkg: PhotographyPackage) => {
    setSelectedPkg(pkg);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  return (
    <>
      {/* Responsive Visual Cards Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => (
          <VisualPackageCard
            key={pkg.id}
            pkg={pkg}
            onOpenDetail={handleOpenDetail}
          />
        ))}
      </div>

      {/* Elegant Package Detail Modal */}
      <PackageDetailModal
        pkg={selectedPkg}
        isOpen={detailOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
}
