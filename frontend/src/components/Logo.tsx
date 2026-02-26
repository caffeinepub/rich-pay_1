interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 32, md: 48, lg: 80 };

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const px = sizes[size];
  return (
    <img
      src="/assets/generated/richpay-logo.dim_256x256.png"
      alt="Rich Pay Logo"
      width={px}
      height={px}
      className={`object-contain ${className}`}
    />
  );
}
