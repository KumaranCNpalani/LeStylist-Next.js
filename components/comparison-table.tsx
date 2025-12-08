import { Check, X } from "lucide-react"

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="px-6 py-4 text-left font-medium">Feature</th>
            <th className="px-6 py-4 text-center font-medium">Traditional Reading</th>
            <th className="px-6 py-4 text-center font-medium bg-primary/10">Rhythm Device</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-6 py-4">Distraction-Free</td>
            <td className="px-6 py-4 text-center">
              <X className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-4">Science-Backed Design</td>
            <td className="px-6 py-4 text-center">
              <X className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-4">Personalized Experience</td>
            <td className="px-6 py-4 text-center">
              <X className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-4">Friendly Mascot Guide</td>
            <td className="px-6 py-4 text-center">
              <X className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-4">Eye Strain Reduction</td>
            <td className="px-6 py-4 text-center">
              <X className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-4">Works Offline</td>
            <td className="px-6 py-4 text-center">
              <Check className="mx-auto h-5 w-5 text-muted-foreground" />
            </td>
            <td className="px-6 py-4 text-center bg-primary/5">
              <Check className="mx-auto h-5 w-5 text-primary" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
